import { useState, useEffect } from 'react'
import {Grid, GridColumn, GridColumnReorderEvent, GridColumnResizeEvent, GridFilterChangeEvent, GridPageChangeEvent, GridSortChangeEvent} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
import { useParams } from 'react-router-dom';
import DrawerContainer from './drawerContainer';
import { PagerTargetEvent } from '@progress/kendo-react-data-tools';

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
const initialDataState: PageState = { skip: 0, take: 15 };
const initialColumns = [
  { field: "Seq-num", title: "Seq-num", orderIndex: 0, width: '150px'},
  { field: "Item-code", title: "Item-code", orderIndex: 1, width: '200px' },
  { field: "Branch", title: "Branch", orderIndex: 2, width: '150px' },
  { field: "Date-activity", title: "Date-Activity", orderIndex: 3, width: '150px'},
  ];


const url = 'http://localhost:8080/jttcust'
const colooUrl = 'http://localhost:8080/coloo'

const iauDataGrid : React.FC = () => {
    const { id } = useParams()
    const userId = id as string;

    const [iauData, setIauData] = useState<iauData[]>();
    const [cols, setCols] = useState<column[]>(initialColumns);
    const [loading, setLoading] = useState<boolean>(true);
    const [loading2, setLoading2] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [total, setTotal] = useState<number> (0);
    const [numButtons, setNumButtons] = useState<number> (5);
    const [page, setPage] = useState<PageState>(initialDataState);
    const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>();
    const [sort, setSort] = useState<[string, string | undefined]>(["Item-code", "asc"]);
    const [filter, setFilter] = useState<filter | undefined>(undefined);
    


    function getFilterInfo(filterInfo : filter | undefined) : string {
        var queryOptions = ""
        if (filterInfo != undefined) {
        var filterField = filterInfo.field
        var filterValue = filterInfo.value
        if (filterField == 'Seq-num'){
            filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
        } else if (filterField == "Date-activity") {
            filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
        } else {
            filterField = "\"" + filterField + "\"";
        }
        switch(filterInfo.operator){
            case('contains'):
                queryOptions += "WHERE " + filterField + " LIKE \'*" + filterInfo.value +"*\'"
                break;
            case("doesnotcontain"):
                queryOptions += "WHERE " + filterField + " NOT LIKE \'*" + filterInfo.value +"*\'"
                break;
            case('eq'):
                queryOptions += "WHERE " + filterField + " = \'" + filterInfo.value +"\'"
                break;
            case('neq'):
                queryOptions += "WHERE " + filterField + " != \'" + filterInfo.value +"\'"
                break;
            case('startswith'):
                queryOptions += "WHERE " + filterField + " LIKE \'" + filterInfo.value +"*\'"
                break;
            case('endswith'):
                queryOptions += "WHERE " + filterField + " LIKE \'*" + filterInfo.value +"\'"
                break;
            case('isnull'):
                queryOptions += "WHERE " + filterField + " = \'\'"
                break;
        }
        } 
        return queryOptions;
    }
    function getPageInfo(pageInfo : PageState) : string {
        const result = "OFFSET " + pageInfo.skip as string + " ROWS FETCH NEXT " + pageInfo.take as string + " ROWS ONLY ";
        return result;
    }

    function getSortInfo(sortInfo : [String, String | undefined]) : string {
        const result = "ORDER BY \"" + sortInfo[0] as string + "\" " + sortInfo[1] as string;
        return result;
    }

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
    //function to run the SQL query with the parameters to mimic the paging and additional features.
    const fetchIauWithSQL = async(options : string) => {
        setLoading2(true);
        try {
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

    


    const sortChange = (event: GridSortChangeEvent) => {
        console.log(event);
        const evsort = ({...event.sort})
        var queryOptions = "";
        queryOptions += getFilterInfo(filter);
        if (evsort[0] != undefined){
            setSort(
                [evsort[0].field, evsort[0].dir]
            );
            queryOptions += " ORDER BY \"" + evsort[0].field + "\" " + evsort[0].dir;
        } else {
            setSort(
                ["Item-code", "asc"]
            )
            queryOptions += " ORDER BY \"Item-code\" asc";
        }
            //fetchNewTotalWithOptions(queryOptions);
            queryOptions += " " + getPageInfo(page);
            fetchIauWithSQL(queryOptions);
    }

    const filterChange = (event: GridFilterChangeEvent) => {
        console.log(event);
    const evfilt = ({...event.filter})
    var queryOptions = ""
    if (evfilt.filters != undefined){
      setFilter(
        evfilt.filters[0] as filter
      );
      const filt = evfilt.filters[0] as filter;
      var filterField = filt.field
       if (filterField == 'Seq-num'){
            filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
        } else if (filterField == "Date-activity") {
            filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
        } else {
            filterField = "\"" + filterField + "\"";
        }
      switch(filt.operator){
        case('contains'):
          queryOptions += "WHERE " + filterField + " LIKE \'*" + filt.value +"*\'"
          break;
        case("doesnotcontain"):
          queryOptions += "WHERE " + filterField + " NOT LIKE \'*" + filt.value +"*\'"
          break;
        case('eq'):
          queryOptions += "WHERE " + filterField + " = \'" + filt.value +"\'"
          break;
        case('neq'):
          queryOptions += "WHERE " + filterField + " != \'" + filt.value +"\'"
          break;
        case('startswith'):
          queryOptions += "WHERE " + filterField + " LIKE \'" + filt.value +"*\'"
          break;
        case('endswith'):
          queryOptions += "WHERE " + filterField + " LIKE \'*" + filt.value +"\'"
          break;
        case('isnull'):
          queryOptions += "WHERE " + filterField + " = \'\'"
          break;
      }
    } else {
      setFilter(
        undefined
      );
      queryOptions+= "WHERE 1=1"
    }
    fetchNewTotalWithOptions(queryOptions)
    queryOptions += ' ' + getSortInfo(sort) + ' ' + getPageInfo(page)
    fetchIauWithSQL(queryOptions);
    }

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
            queryOptions += getFilterInfo(filter) + " " + getSortInfo(sort);
        } else {
            queryOptions += getFilterInfo(filter) + " " + getSortInfo(sort) + " OFFSET " + newSkip as string + " ROWS FETCH NEXT " + newPage as string + " ROWS ONLY";
        }
        fetchIauWithSQL(queryOptions);
    }

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

    useEffect(() => {
        const fetchTotal = async() => {
          try {
            const result = await fetch(url + "/iauData/total/WHERE 1=1")
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

    useEffect(() => {
        const fetchIau = async () => {
            try {
                fetchIauWithSQL(getSortInfo(sort) + ' ' + getPageInfo(page));
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        };
        fetchIau();
    }, []);
    
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
    // if (loading2) return (
    //     <DrawerContainer>
    //         <p>Loading...</p>
    //     </DrawerContainer>);
    if (error) return <p>Error: {error}</p>;
    return (
    <DrawerContainer>
      <div>
        <h1>Customers</h1>
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