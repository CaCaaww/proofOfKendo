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

interface iauData{
    seqNum: string;
    itemCode: string;
    branch: string;
    dateActivity: string;
}
interface column {
  field: string;
  title: string;
  orderIndex: number;
  width: string;
}
interface PageState {
  skip: number;
  take: number;
}
interface filter {
  field: string;
  operator: string;
  value: string;
}
interface betDateInfo {
    startDate : string;
    endDate: string;
}
const initialDataState: PageState = { skip: 0, take: 15 };
const initialColumns = [
  { field: "Seq-num", title: "Seq-num", orderIndex: 3, width: '150px'},
  { field: "Item-code", title: "Item-code", orderIndex: 1, width: '200px' },
  { field: "Branch", title: "Branch", orderIndex: 2, width: '150px' },
  { field: "Date-activity", title: "Date-Activity", orderIndex: 0, width: '150px'},
  ];



const url = 'http://localhost:8080/jttcust'
const colooUrl = 'http://localhost:8080/coloo'

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
    const [numButtons, setNumButtons] = useState<number> (5); //number of page buttons on the bottom scrollbar
    const [page, setPage] = useState<PageState>(initialDataState); //stores a PageState, which stores the skip and take of a page.
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>(); //stores how many rows per page.
    const [sort, setSort] = useState<[string, string | undefined]>(["Date-activity", "asc"]); //stores the parameters for sorting the data (what column to sort by and asc or desc)
    const [filter, setFilter] = useState<filter | undefined>(undefined); //stores the filter paramets (column to filter by, how much of the string needs to match, and the value to match it against)

    const initialDates = {startDate: '07-01-2020', endDate: '01-01-3000'} //the initial dates that the data is bounded by
    const [betDates, setBetDates] = useState<betDateInfo>(initialDates as betDateInfo); //storing the dates that the data is bounded by

    const dateRegex: RegExp = new RegExp(/^\d\d\-\d\d\-\d\d\d\d$/); //Regex to check if an inputed date is in the correct format
    const dateValidator = (value: string) => (dateRegex.test(value) ? '' : 'Please enter a valid date.'); //"function" to check if an inputed date is valid
    
    //object that defines the input field for the form
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
    function getBetweenDateInfo(dateInfo: betDateInfo) : string {
        var queryOptions = "\"Date-activity\" BETWEEN TO_DATE(\'" + dateInfo.startDate + "\') AND TO_DATE(\'" + dateInfo.endDate + "\')" 
        return queryOptions;
    }

    //function to return the query section that filter the data
    function getFilterInfo(filterInfo : filter | undefined) : string {
        var queryOptions = ""
        if (filterInfo != undefined) {
            var filterField = filterInfo.field
            //var filterValue = filterInfo.value
            if (filterField == 'Seq-num'){
                filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
            } else if (filterField == "Date-activity") {
                filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
            } else {
                filterField = "\"" + filterField + "\"";
            }
            switch(filterInfo.operator){
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
        } else {
            queryOptions += "1=1"
        }
        return queryOptions;
    }

    //function to return the section of the SQL query that ensures that only the section of the data needed for the current page is returned.
    function getPageInfo(pageInfo : PageState) : string {
        const result = "OFFSET " + pageInfo.skip as string + " ROWS FETCH NEXT " + pageInfo.take as string + " ROWS ONLY ";
        return result;
    }

    //function to return the section of the SQL query that will order the data
    function getSortInfo(sortInfo : [String, String | undefined]) : string {
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
        setLoading2(true);
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
            setLoading2(false);
        }
    }

    //function that handles when the user clicks on a row to sort by that row
    const sortChange = (event: GridSortChangeEvent) => {
        console.log(event);
        const evsort = ({...event.sort})
        var queryOptions = "WHERE ";
        queryOptions += getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter);
        if (evsort[0] != undefined){
            setSort(
                [evsort[0].field, evsort[0].dir]
            );
            queryOptions += getSortInfo([evsort[0].field, evsort[0].dir])
        } else {
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
        if (evfilt.filters != undefined){
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
        if (targetEvent.value === 'All'){
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
        if (targetEvent.value === 'All'){
            queryOptions += 'WHERE ' + getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter) + " " + getSortInfo(sort);
        } else {
            queryOptions += 'WHERE ' + getBetweenDateInfo(betDates) + ' AND ' + getFilterInfo(filter) + " " + getSortInfo(sort) + ' ' + getPageInfo({skip : newSkip,take : newPage} as PageState);
        }
        fetchIauWithSQL(queryOptions);
    }

    //function to handle the reordering of the columns
    const handleColumnReorder = (event: GridColumnReorderEvent) => {
        const reorderedColumns = event.columns;
        const updateColumns = async () => {
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
        if (element.orderIndex == event.index){
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
            setCols(newCols);
        }
        updateColumns();
    }

    //function to handle the submission of the data
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
            const result = await fetch(url + "/iauData/total/WHERE  " + getBetweenDateInfo(betDates))
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

    if (loading) return (
        <DrawerContainer>
            <p>Loading...</p>
        </DrawerContainer>);
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