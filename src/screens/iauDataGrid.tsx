import { useState, useEffect } from 'react'
import {Grid, GridColumn, GridColumnReorderEvent, GridColumnResizeEvent, GridFilterChangeEvent, GridPageChangeEvent, GridSortChangeEvent} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
import { useParams } from 'react-router-dom';
import DrawerContainer from './drawerContainer';
import { PagerTargetEvent } from '@progress/kendo-react-data-tools';
import { Field, FieldWrapper, FormElement, Form, FieldRenderProps, FormRenderProps } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Error as Error2 } from '@progress/kendo-react-labels';

//interface that models the data stored in the grid. 
interface iauData{
    seqNum: string; 
    itemCode: string;
    branch: string;
    dateActivity: string;
}
//interface that models the properties of a column object
interface column {
  field: string; //a sort of columnId
  title: string; //the label of the column to be displayed
  orderIndex: number; //the left-to-right index of the column
  width: string; //the width of the column
}
//interface that models the data object that stores the information about the page
interface PageState {
  skip: number; //how many rows to offset
  take: number; //how many rows to return
}
//interface that models the data object that stores the information about the filter
interface filter {
  field: string; //column name of filtered field
  operator: string; //tells how much of the data needs to match, ie: 'contains', 'does not contain', 'starts with', 'ends with', etc.
  value: string; //the string to filter with -- the inputed string that the data is matched against.
}
//interface that models the data object that stores the information about the start and end date
interface betDateInfo {
    startDate : string;
    endDate: string;
}
//initial configuration of items
const initialDataState: PageState = { skip: 0, take: 15 };
const initialColumns = [
  { field: "Seq-num", title: "Seq-num", orderIndex: 3, width: '150px'},
  { field: "Item-code", title: "Item-code", orderIndex: 1, width: '200px' },
  { field: "Branch", title: "Branch", orderIndex: 2, width: '150px' },
  { field: "Date-activity", title: "Date-Activity", orderIndex: 0, width: '150px'},
  ];



const url = 'http://localhost:8080/jttcust' //the url to talk to the jdbc -- where the data is largely grabbed from
const colooUrl = 'http://localhost:8080/coloo' //the url to talk to the json file that stores the column order information

const iauDataGrid : React.FC = () => {
    // these two are the userId parameters, gotten from the login and carried through the route URL's
    const { id } = useParams()
    const userId = id as string;

    const [iauData, setIauData] = useState<iauData[]>(); //The data displayed on the grid
    const [cols, setCols] = useState<column[]>(initialColumns); // data that stores the order and size of the columns (along with their name and field)
    const [loading, setLoading] = useState<boolean>(true); //Stores true on data initially loading, false otherwise
    const [loading2, setLoading2] = useState<boolean>(false); //store true on data loading from a change in the data state, false otherwise
    const [error, setError] = useState<string | null>(null); //stores an error if one occurs, null otherwise

    const [total, setTotal] = useState<number> (0); //total number of rows of data, stored so the grid knows how many pages it needs to make
    const [numButtons] = useState<number> (5); //number of page buttons on the bottom scrollbar
    const [page, setPage] = useState<PageState>(initialDataState); //stores a PageState, which stores the skip and take of a page.
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>(); //stores how many rows per page.
    const [sort, setSort] = useState<[string, string | undefined]>(["Date-activity", "asc"]); //stores the parameters for sorting the data (what column to sort by and asc or desc)
    const [filter, setFilter] = useState<filter | undefined>(undefined); //stores the filter paramets (column to filter by, how much of the string needs to match, and the value to match it against)

    const initialDates = {startDate: '07-01-2020', endDate: '01-01-3000'} //the initial dates that the data is bounded by
    const [betDates, setBetDates] = useState<betDateInfo>(initialDates as betDateInfo); //storing the dates that the data is bounded by

    const dateRegex: RegExp = new RegExp(/^\d\d\-\d\d\-\d\d\d\d$/); //Regex to check if an inputed date is in the correct format: mm-dd--yyyy    -- the ^ represents the start of the string and the $ represents the end
    const dateValidator = (value: string) => (dateRegex.test(value) ? '' : 'Please enter a valid date.'); //"function" to check if an inputed date is valid
    
    //object that defines the input field for the form -- idk how it works, was given in the kendo react documentation.
    const dateInput = (fieldRenderProps: FieldRenderProps) => {
        const { validationMessage, visited, ...others } = fieldRenderProps;
        return (
            <div>
                <Input {...others} />
                {visited && validationMessage && <Error2>{validationMessage}</Error2>}
            </div>
        );
    };
    
    //function to return the query section that will limit the data to between dates specified by the user through the form.
    //passed into it is a betDateInfo object, the type that stores the betDates info. Note, the function does not grab directly from that object, allowing
    // us to pass different start and end dates into the function, which are then formatted to be used checked against in a SQL query.
    function getBetweenDateInfo(dateInfo: betDateInfo) : string {
        //SQL query syntax that it models: "Date-activity" BETWEEN start AND end
        // NOTICE, there is no 'WHERE' in this section. The 'WHERE' part of the WHERE clause needs to be added in separately. This gives us more flexibility later 
        // on when we might have multiple things to check against in the where clause, and multiple instances of 'WHERE' would ruin the SQL syntax.
        var queryOptions = "\"Date-activity\" BETWEEN TO_DATE(\'" + dateInfo.startDate + "\') AND TO_DATE(\'" + dateInfo.endDate + "\')" 
        return queryOptions;
    }

    //function to return the query section that filter the data
    function getFilterInfo(filterInfo : filter | undefined) : string {
        var queryOptions = ""
        if (filterInfo != undefined) { //the filter event could be 'undefined' if the user is clearing the filter
            var filterField = filterInfo.field
            if (filterField == 'Seq-num'){ //Seq-num in the SQL database is an integer, and cannot use %'s, which are important to
            // the like clause. To get around this, we cast the integer in the database to a Varchar -- a SQL string -- because the user input is already in string format
                filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
            } else if (filterField == "Date-activity") { //same reason for this as above, but instead of an integer its a sysdate. 
                filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
            } else {
                filterField = "\"" + filterField + "\"";
            }
            //above notice the importance of adding ""s around the columnName. Many of the columns in the database have - 's in them, which can break the syntax of a 
            // string unless the column name is in ""s. '' is for varchars, "" is for column names.
            switch(filterInfo.operator){ // switch case for the different types of operators, which signify how much of the string needs to match.
                case('contains'):
                    queryOptions +=  filterField + " LIKE \'*" + filterInfo.value +"*\'"
                    break;
                case("doesnotcontain"):
                    queryOptions +=  filterField + " NOT LIKE \'*" + filterInfo.value +"*\'"
                    break;
                case('eq'):
                    queryOptions +=  filterField + " = \'" + filterInfo.value +"\'"
                    break;
                case('neq'):
                    queryOptions +=  filterField + " != \'" + filterInfo.value +"\'"
                    break;
                case('startswith'):
                    queryOptions +=  filterField + " LIKE \'" + filterInfo.value +"*\'"
                    break;
                case('endswith'):
                    queryOptions +=  filterField + " LIKE \'*" + filterInfo.value +"\'"
                    break;
                case('isnull'):
                    queryOptions +=  filterField + " = \'\'"
                    break;
            }
        } else { //this is to ensure that at all times, there is something in the options section. It doesn't add any time and removes some syntax errors that can pop up
            // if nothing is being filtered.
            queryOptions += "1=1"
        }
        return queryOptions;
    }

    //function to return the section of the SQL query that ensures that only the section of the data needed for the current page is returned.
    function getPageInfo(pageInfo : PageState) : string {
        //SQL syntax: OFFSET x ROWS FETCH NEXT y ROWS ONLY
        const result = "OFFSET " + pageInfo.skip as string + " ROWS FETCH NEXT " + pageInfo.take as string + " ROWS ONLY ";
        return result;
    }

    //function to return the section of the SQL query that will order the data
    function getSortInfo(sortInfo : [String, String | undefined]) : string {
        // SQL syntax: ORDER BY "columnid" ASC/DESC
        const result = "ORDER BY \"" + sortInfo[0] as string + "\" " + sortInfo[1] as string;
        return result;
    }

    //function to fetch the total number of rows after the data has been filtered and sorted (but not paged)
    const fetchNewTotalWithOptions = async(options: string) => {
        try {
            const response = await fetch(url + "/iauData/total/" + options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
                }
            const newTotal = await response.json()
            setTotal(newTotal);
        } catch (err){
            setError((err as Error).message);
        }
    }

    //function to fetch the data with a SQL query, where options is the section of the SQL query that will filter, sort, and page the data
    const fetchIauWithSQL = async(options : string) => {
        setLoading2(true); //loading2 is a bool that has the html put up a loading message while the data is being fetched because some of the queries can take a while
        try {
            //console.log("OPTIONS: " + options)
            const response = await fetch(url + "/sql/iauData/" + options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
                }
            const data: iauData[] = await response.json();
            setIauData(data)
        } catch (err){
            setError((err as Error).message);
        } finally {
            setLoading2(false); //removes the loading message
        }
    }

    //function that handles when the user clicks on a row to sort by that row
    const sortChange = (event: GridSortChangeEvent) => {
        console.log(event);
        const evsort = ({...event.sort}) 
        //the query options need to go in a specific order to avoid breaking syntax: WHERE -> ORDER -> OFFSET+FETCH
        // sorting falls into the order section, and thus before we add the query option for the sorting, we need to get the where parts locally stored.
        var queryOptions = "WHERE ";
        queryOptions += getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter);
        if (evsort[0] != undefined){ //sort is undefined if no sort is selected on the grid
            setSort(
                [evsort[0].field, evsort[0].dir]
            );
            queryOptions += getSortInfo([evsort[0].field, evsort[0].dir]) //notice that we're not calling getSortInfo with parameters of the from the sort object stored.
            // this is because even though we set the sort object above, the changes (for some reason) haven't gone through, and if we call getSortInfo(sort), it will
            // use the old sort, and not the new one.
        } else { 
            // the default sort.
            setSort(
                ["Date-activity", "asc"]
            )
            queryOptions += " ORDER BY \"Date-activity\" asc";
        }
            queryOptions += " " + getPageInfo(page);
            fetchIauWithSQL(queryOptions);
    }

    //function that handles when the user filters the data
    const filterChange = (event: GridFilterChangeEvent) => {
        console.log(event);
        const evfilt = ({...event.filter})
        var queryOptions = "WHERE " + getBetweenDateInfo(betDates) + ' AND ' 
        if (evfilt.filters != undefined){ //filter is undefined if the filter is cleared.
            setFilter(
                evfilt.filters[0] as filter
            );
            queryOptions += getFilterInfo(evfilt.filters[0] as filter)
        } else {
            setFilter(
                undefined
            );
            queryOptions+= " 1=1"
        }
        fetchNewTotalWithOptions(queryOptions)
        queryOptions += ' ' + getSortInfo(sort) + ' ' + getPageInfo(page)
        fetchIauWithSQL(queryOptions);
    }

    //function to handle paging of the data
    const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        var take = event.page.take;
        if (targetEvent.value === 'All'){ // the take can be set to 'all', and since that is not a number, we need to make it the total.
            take = total;
        }
        console.log(event)
        if (targetEvent.value) {
            setPageSizeValue(targetEvent.value);
        }
        setPage({
            ...event.page,
            take
        });
        const newSkip = {...event.page}.skip
        const newPage = {...event.page}.take
        var queryOptions = "";
        if (targetEvent.value === 'All'){ //if the take is 'all', then we don't need to add the page infomation (because there's only one page)
            queryOptions += 'WHERE ' + getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter) + " " + getSortInfo(sort);
        } else {
            queryOptions += 'WHERE ' + getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter) + " " + getSortInfo(sort) + ' ' + getPageInfo({skip : newSkip,take : newPage} as PageState);
        }
        fetchIauWithSQL(queryOptions);
    }

    //function to handle the reordering of the columns
    const handleColumnReorder = (event: GridColumnReorderEvent) => {
        const reorderedColumns = event.columns;
        const updateColumns = async () => { // we call and update request, knowing that the user will have a column order object to update because if they didn't have one, one would be given to them when they accessed the grid
            const responseUpdate = await fetch("http://localhost:8080/coloo", {
                method: "PUT",
                headers: {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify({"userId": userId, "columnId": "iauData", "dataColumns": reorderedColumns as column[]})
            });
            setCols(reorderedColumns as column[]);
            console.log(responseUpdate);
        }
        updateColumns();
    }

    //function to handle the resizing of the columns
    const onColumnResize = (event: GridColumnResizeEvent) => {
        const newCols = cols;
        newCols.forEach( (element) => {
        if (element.orderIndex == event.index){ //doing this because event.width is actually the old width of the column, before it was resized.
            element.width = event.newWidth + "";
        }
        })
        const updateColumns = async () => {
            const responseUpdate = await fetch("http://localhost:8080/coloo", {
                method: "PUT",
                headers: {
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify({"userId": userId, "columnId": "iauData", "dataColumns": newCols as column[]})
            });
            console.log(responseUpdate)
            setCols(newCols);
        }
        updateColumns();
    }

    //function to handle the submission of the data of the time range.
    const handleSubmit = async (dataItems : {[startDate: string] : any } ) => {
        setBetDates({startDate: dataItems.startDate, endDate : dataItems.endDate} as betDateInfo)
        var queryOptions = 'WHERE ' + getBetweenDateInfo({startDate: dataItems.startDate, endDate : dataItems.endDate} as betDateInfo) + ' AND ' + getFilterInfo(filter) 
        fetchNewTotalWithOptions(queryOptions)
        queryOptions += ' ' + getSortInfo(sort) +  ' ' + getPageInfo(page)
        fetchIauWithSQL(queryOptions)
    }

    //function to fetch the initial total of the data. Only happens once
    useEffect(() => {
        const fetchTotal = async() => {
          try {
            const result = await fetch(url + "/iauData/total/WHERE  " + getBetweenDateInfo(betDates)) //there is likely a pre-given time range to limit by because the size of the data is enormous
            if (!result.ok){
              throw new Error(`Error: ${result.statusText}`);
            }
            setTotal(await result.json());
          } catch (err) {
            console.error("Error fetching total data:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchTotal();
      }, []);

    // function to fetch the data initially. Only happens once
    useEffect(() => {
        const fetchIau = async () => {
            try {
                fetchIauWithSQL('WHERE ' + getBetweenDateInfo(betDates) + ' '  + getSortInfo(sort) + ' ' + getPageInfo(page));
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        };
        fetchIau();
    }, []);
    
    //function that gets the saved column order for the user, or creates a new one if they don't have one.
    useEffect(() => {
        const fetchCols = async () => {
            try {
                //check if the user already has a data table configuration for the cust data
                const newColooUrl = colooUrl + "/" + userId + "iauData";
                const response = await
                fetch(newColooUrl);
                if(!response.ok){
                    if (response.status != 404){
                        throw new Error(`Error: ${response.statusText}`);
                    }
                    setCols(initialColumns)
                        const response2 = await fetch('http://localhost:8080/coloo', {
                            method: "POST",
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({"userId":userId,"columnId":"iauData","dataColumns":initialColumns}),
                    });
                    const result = await response2.json();
                    console.log(result)
                }
                const result : column[] = await response.json()
                setCols(result)
            } catch (error){
                console.error("Error fetching column data:", error);
            }
        }
        fetchCols();
    }, []);

    //tells us if the data is initially loading to have the page only say loading, but still have the sidebar.
    if (loading) return (
        <DrawerContainer>
            <p>Loading...</p>
        </DrawerContainer>);
    //blanks the page if there is an error.
    if (error) return <p>Error: {error}</p>;
    return (
    <DrawerContainer>
      <div>
        <h1>IAU Data</h1>
        <Form
        onSubmit={handleSubmit}
        initialValues={{
            startDate: '07-01-2020',
            endDate : '01-01-3000'
        }}
        render = {(formRenderProps: FormRenderProps) =>(
            <FormElement>
                <fieldset className={'k-form-fieldset'}>
                        <FieldWrapper>
                            <div className="k-form-field-wrap">
                                <Field
                                    name={'startDate'}
                                    component={dateInput}
                                    label={'Begin Date'}
                                    labelClassName="k-form-label"
                                    validator={dateValidator}
                                />
                            </div>
                        </FieldWrapper>

                        <FieldWrapper>
                            <div className="k-form-field-wrap">
                                <Field
                                    name={'endDate'}
                                    component={dateInput}
                                    label={'End Date'}
                                    labelClassName="k-form-label"
                                    validator={dateValidator}
                                />
                            </div>
                        </FieldWrapper>

                    </fieldset>
                    <div className="k-form-buttons">
                        <Button disabled={!formRenderProps.allowSubmit}>Submit</Button>
                    </div>
            </FormElement>

        )}
        />
        {loading2? <p>loading...</p>: <p></p>}
        <Grid
          style={{ height: '700px'}} 
          data={iauData} 

          sortable={true}
          onSortChange={sortChange}

          filterable={true}
          onFilterChange={filterChange}

          skip={page.skip}
          take={page.take}
          total={total}
        
          reorderable={true}
          resizable={true}

          pageable={{
            buttonCount: numButtons,
            pageSizes: [5, 10, 15, 'All'],
            pageSizeValue: pageSizeValue
          }}
          onPageChange={pageChange}

          onColumnReorder={handleColumnReorder}
          onColumnResize={onColumnResize}
          >
          {cols.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
          ))}
        </Grid>
      </div>
    </DrawerContainer>
    )


};
export default iauDataGrid;