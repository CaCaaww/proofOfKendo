import { useState, useEffect } from 'react'
import {Grid, GridColumn, GridFilterChangeEvent, GridPageChangeEvent, GridSortChangeEvent} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
import { useParams } from 'react-router-dom';
import { PagerTargetEvent } from '@progress/kendo-react-data-tools';
import DrawerContainer from './drawerContainer';

//import './App.css'

const url = 'http://localhost:8040/ttcustBackend/jttcust'
const colooUrl = 'http://localhost:8040/ttcustBackend/coloo'

//column Id is: custData

interface SEQ_Data{
  custID: string;
  seqPre?: string;
  seqNum?: number;
}
interface Customer {
  custID: string;
  NAME?: string;
  billToCity?: string;
  billToState?: string;
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
  { field: "customer", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "bill-to-city", title: "City", orderIndex: 1, width: '120px' },
  { field: "bill-to-state", title: "State", orderIndex: 2, width: '200px' },
  { field: "NAME", title: "Customer Name", orderIndex: 3, width: '400px' },
  ];

const initialData2Columns = [
  { field: "customer", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "Seq-pre", title: "SEQ-PRE", orderIndex: 1, width: '150px'},
  { field: "Seq-num", title: "SEQ-NUM", orderIndex: 2, width: "150px"},
]


const ttcustDataGrid : React.FC = () => {
  const { id } = useParams()
  const userId = id as string;
  const [total, setTotal] = useState<number> (0);
  const [numButtons] = useState<number> (5);

  

  const [page, setPage] = useState<PageState>(initialDataState);
  const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>();
  const [sort, setSort] = useState<[string, string | undefined]>(["customer", "asc"]);
  const [filter, setFilter] = useState<filter | undefined>(undefined);

  const [page2, setPage2] = useState<PageState>(initialDataState);
  const [pageSizeValue2, setPageSizeValue2] = useState<number | string | undefined>();
  const [total2, setTotal2] = useState<number> (0);
  const [numButtons2] = useState<number> (5);
  const [sort2, setSort2] = useState<[string, string | undefined]>(["customer", "asc"]);
  const [filter2, setFilter2] = useState<filter | undefined>(undefined);
  const [data2, setData2] = useState<SEQ_Data[]>([]);
  const [clickedCustomer, setClikcedCustomer] = useState<String>();
  
  const [cols, setCols] = useState<column[]>(initialColumns);
  const [cols2, setCols2] = useState<column[]>(initialData2Columns)
  const [custs, setCusts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotal = async() => {
      try {
        const result = await fetch(url + "/total")
        if (!result.ok){
          throw new Error(`Error: ${result.statusText}`);
        }
        setTotal(await result.json());
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchTotal();
  }, []);
  

  useEffect(() => {
    const fetchCusts = async () => {
      try {
        // const response = await
        // fetch(url + "/btw/" + page.take + "," + page.skip);
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }
        // const data: Customer[] = await response.json();
        // //console.log(data)
        // setCusts(data)
        fetchCustsWithSQL(getPageInfo(page));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCusts();
  }, []);

  // getting info for the different parts of the SQL query
  function getFilterInfo(filterInfo : filter | undefined) : string {
    var queryOptions = ""
    if (filterInfo != undefined) {
      var filterField = filterInfo.field
      if (filterField == 'Seq-num'){
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
            queryOptions += "WHERE \"" + filterInfo.field + "\" = \'" + filterInfo.value +"\'"
            break;
          case('neq'):
            queryOptions += "WHERE \"" + filterInfo.field + "\" != \'" + filterInfo.value +"\'"
            break;
          case('startswith'):
            queryOptions += "WHERE " + filterField + " LIKE \'" + filterInfo.value +"*\'"
            break;
          case('endswith'):
            queryOptions += "WHERE " + filterField + " LIKE \'*" + filterInfo.value +"\'"
            break;
          case('isnull'):
            queryOptions += "WHERE \"" + filterInfo.field + "\" = \'\'"
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

  //function to get the new total after the query
  const fetchNewTotalWithOptions = async(options: string) => {
     try {
      const response = await fetch(url + "/custData/total/" + options);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      const newTotal = await response.json()
      setTotal(newTotal);
    } catch (err){
      setError((err as Error).message);
    }
  }

  const fetchNewSeqTotalWithOptions = async(options: string) => {
     try {
      const response = await fetch(url + "/seqData/total/" + options);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      const newTotal = await response.json()
      setTotal2(newTotal);
    } catch (err){
      setError((err as Error).message);
    }
  }

  //function to run the SQL query with the parameters to mimic the paging and additional features.
  const fetchCustsWithSQL = async(options : string) => {
    try {
      const response = await fetch(url + "/sql/custData/" + options);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      const data: Customer[] = await response.json();
      setCusts(data)
    } catch (err){
      setError((err as Error).message);
    }
  }

  const fetchSeqWithSQL = async(options : string) => {
    try {
      //console.log("HERE")
      const response = await fetch(url + "/sql/seqData/" + options);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      const newData2: SEQ_Data[] = await response.json();
      //console.log(newData2);
      setData2(newData2)
    } catch (err){
      setError((err as Error).message);
    }
  }

  //function that handles when the data is to be resorted.
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
        ["Customer", "asc"]
      )
      queryOptions += " ORDER BY Customer asc";
    }
    //fetchNewTotalWithOptions(queryOptions);
    queryOptions += " " + getPageInfo(page);
    fetchCustsWithSQL(queryOptions);
  }

  const sortChange2 = (event: GridSortChangeEvent) => {
    console.log(event);
    const evsort = ({...event.sort})
    var queryOptions = "";
    var filterInfo = getFilterInfo(filter2);
        var queryOptions = "";
        if (filterInfo === "") {
          queryOptions += "WHERE \"Customer\" = \'" + clickedCustomer + "\' "  
        } else {
          queryOptions += filterInfo + " AND \"Customer\" = \'" + clickedCustomer + "\' "
        }
    if (evsort[0] != undefined){
      setSort2(
        [evsort[0].field, evsort[0].dir]
      );
      queryOptions += " ORDER BY \"" + evsort[0].field + "\" " + evsort[0].dir;
    } else {
      setSort2(
        ["Customer", "asc"]
      )
      queryOptions += " ORDER BY Customer asc";
    }
    //fetchNewTotalWithOptions(queryOptions);
    queryOptions += " " + getPageInfo(page2);
    fetchSeqWithSQL(queryOptions);
  }
  //funciton to handle when things have been added to ONE filter.
  const filterChange = (event: GridFilterChangeEvent) => {
    console.log(event);
    const evfilt = ({...event.filter})
    var queryOptions = ""
    if (evfilt.filters != undefined){
      setFilter(
        evfilt.filters[0] as filter
      );
      const filt = evfilt.filters[0] as filter;
      switch(filt.operator){
        case('contains'):
          queryOptions += "WHERE \"" + filt.field + "\" LIKE \'*" + filt.value +"*\'"
          break;
        case("doesnotcontain"):
          queryOptions += "WHERE \"" + filt.field + "\" NOT LIKE \'*" + filt.value +"*\'"
          break;
        case('eq'):
          queryOptions += "WHERE \"" + filt.field + "\" = \'" + filt.value +"\'"
          break;
        case('neq'):
          queryOptions += "WHERE \"" + filt.field + "\" != \'" + filt.value +"\'"
          break;
        case('startswith'):
          queryOptions += "WHERE \"" + filt.field + "\" LIKE \'" + filt.value +"*\'"
          break;
        case('endswith'):
          queryOptions += "WHERE \"" + filt.field + "\" LIKE \'*" + filt.value +"\'"
          break;
        case('isnull'):
          queryOptions += "WHERE \"" + filt.field + "\" = \'\'"
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
    fetchCustsWithSQL(queryOptions);
  }

  const filterChange2 = (event: GridFilterChangeEvent) => {
    console.log(event);
    const evfilt = ({...event.filter})
    var queryOptions = ""
    if (evfilt.filters != undefined){
      setFilter2(
        evfilt.filters[0] as filter
      );
      const filt = evfilt.filters[0] as filter;
      var filterField = filt.field
      if (filterField == 'Seq-num'){
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
          queryOptions += "WHERE \"" + filt.field + "\" = \'" + filt.value +"\'"
          break;
        case('neq'):
          queryOptions += "WHERE \"" + filt.field + "\" != \'" + filt.value +"\'"
          break;
        case('startswith'):
          queryOptions += "WHERE " + filterField + " LIKE \'" + filt.value +"*\'"
          break;
        case('endswith'):
          queryOptions += "WHERE " + filterField + " LIKE \'*" + filt.value +"\'"
          break;
        case('isnull'):
          queryOptions += "WHERE \"" + filt.field + "\" = \'\'"
          break;
      }
    } else {
      setFilter2(
        undefined
      );
      queryOptions+= "WHERE 1=1"
    }
    queryOptions += " AND \"Customer\" = \'" + clickedCustomer + "\'";
    fetchNewSeqTotalWithOptions(queryOptions)
    queryOptions += ' ' + getSortInfo(sort2) + ' ' + getPageInfo(page2)
    fetchSeqWithSQL(queryOptions);
  }

  //function to handle page changes
  const pageChange = (event: GridPageChangeEvent) => {
        //fetchNewTotalWithOptions(getFilterInfo() + ' ' + getSortInfo());
        const targetEvent = event.targetEvent as PagerTargetEvent;
        //const take = targetEvent.value === 'All' ? custs.length : event.page.take;
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
        fetchCustsWithSQL(queryOptions);
    };

    const pageChange2 = (event: GridPageChangeEvent) => {
        //fetchNewTotalWithOptions(getFilterInfo() + ' ' + getSortInfo());
        const targetEvent = event.targetEvent as PagerTargetEvent;
        //const take = targetEvent.value === 'All' ? custs.length : event.page.take;
        var take = event.page.take;
        if (targetEvent.value === 'All'){
          take = total;
        }
        console.log(event)
        if (targetEvent.value) {
            setPageSizeValue2(targetEvent.value);
        }
        setPage2({
            ...event.page,
            take
        });
        const newSkip = {...event.page}.skip
        const newPage = {...event.page}.take
        var filterInfo = getFilterInfo(filter2);
        var queryOptions = "";
        if (filterInfo === "") {
          queryOptions += "WHERE \"Customer\" = \'" + clickedCustomer + "\' " + getSortInfo(sort2) 
        } else {
          queryOptions += filterInfo + " AND \"Customer\" = \'" + clickedCustomer + "\' " + getSortInfo(sort2)
        }
        if (targetEvent.value != 'All'){
          queryOptions += " OFFSET " + newSkip as string + " ROWS FETCH NEXT " + newPage as string + " ROWS ONLY";
        }
        fetchSeqWithSQL(queryOptions);
    };



  

  
  //getting initial info
  useEffect(() => {
    const fetchCols = async () => {
      try {
        //check if the user already has a data table configuration for the cust data
        const newColooUrl = colooUrl + "/" + userId + "custData";
        const response = await
        fetch(newColooUrl);
        if(!response.ok){
          if (response.status != 404){
            throw new Error(`Error: ${response.statusText}`);
          }
          setCols(initialColumns)
          const response2 = await fetch(colooUrl, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"userId":userId,"columnId":"custData","dataColumns":initialColumns}),
          });
          const result = await response2.json();
          console.log(result)
        }

          const result : column[] = await response.json()
          setCols(result)
      } catch (error){
        console.error("Error fetching data:", error);

      }
      //check if the user already has a data table configuration for the seqData
      try {
        const newColooUrl = colooUrl + "/" + userId + "seqData";
        const response = await
        fetch(newColooUrl);
        if(!response.ok){
          if (response.status != 404){
            throw new Error(`Error: ${response.statusText}`);
          }
          setCols(initialColumns)
          const response2 = await fetch(colooUrl, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"userId":userId,"columnId":"seqData","dataColumns": initialData2Columns}),
          });
          const result = await response2.json();
          console.log(result)
        }

          const result : column[] = await response.json()
          setCols2(result)
      } catch (error){
        console.error("Error fetching data:", error);

      }
    }
    fetchCols();
  }, []);

  const onColumnResize = (event: any) => {
    const newCols = cols;
    newCols.forEach( (element) => {
      if (element.orderIndex == event.index){
        element.width = event.newWidth;
      }
    })
    const updateColumns = async () => {
      const responseUpdate = await fetch(colooUrl, {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "custData", "dataColumns": newCols as column[]})
      });
      console.log(responseUpdate)
      setCols(newCols);
    }
    updateColumns();
  };

  const onColumnResize2 = (event: any) => {
    const newCols2 = cols2;
    newCols2.forEach( (element) => {
      if (element.orderIndex == event.index){
        element.width = event.newWidth;
      }
    })
    const updateColumns = async () => {
      const responseUpdate = await fetch(colooUrl, {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "seqData", "dataColumns": newCols2 as column[]})
      });
      setCols2(newCols2);
      console.log(responseUpdate);
    }
    updateColumns();
  };

  const handleColumnReorder = (event: { columns: any; }) => {
    const reorderedColumns = event.columns;
    const updateColumns = async () => {
      const responseUpdate = await fetch(colooUrl, {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "custData", "dataColumns": reorderedColumns as column[]})
      });
      setCols(reorderedColumns);
      console.log(responseUpdate);
    }
    
    updateColumns();
    
  };
  const handleColumnReorder2 = (event: { columns: any; }) => {
    const reorderedColumns = event.columns;
    const updateColumns = async () => {
      const responseUpdate = await fetch(colooUrl, {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "seqData", "dataColumns": reorderedColumns as column[]})
      });
      setCols2(reorderedColumns);
      console.log(responseUpdate);
    }
    
    updateColumns();
    //
  };

  const handleRowClick = (event: { dataItem: any; }) => {
    const dataItem = event.dataItem
    setClikcedCustomer(dataItem.customer)
    const dataOptions = "WHERE \"Customer\" = \'" + dataItem.customer + "\' " +  getPageInfo(page2);
    fetchNewSeqTotalWithOptions(dataOptions)
    fetchSeqWithSQL(dataOptions);
    // const addDataToSecondGraph = async () => {
    //   try {
    //     const response = await fetch("http://localhost:8080/jttcust/seqData/" + dataItem.customer)
    //     if (!response.ok){
    //       throw new Error(`Error: ${response.statusText}`); 
    //     }
    //     const result : SEQ_Data[] = await response.json()
    //     setData2(result);
    //   } catch (error) {
    //     console.log(error)
    //   } 
    // }
    // addDataToSecondGraph();
  }

  if (loading) return (
    <DrawerContainer>
      <p>Loading...</p>
    </DrawerContainer>
  );
  if (error) return <p>Error: {error}</p>;
  return (
    <DrawerContainer>
    <div>
      <h1>Customers</h1>
      <Grid
        style={{ height: '700px'}} 
        data={custs}
        dataItemKey='customer' 

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
        onRowClick={handleRowClick}
        >
        {cols.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
        ))}
      </Grid>
      
      <h2>Secondary Data</h2>
      <Grid
        style={{height: '700px'}}
        data={data2}
      
        
        sortable={true}
        onSortChange={sortChange2}
        
        pageable={{
          buttonCount: numButtons2,
          pageSizes: [5, 10, 15, 'All'],
          pageSizeValue: pageSizeValue2
        }}
        onPageChange={pageChange2}

        filterable={true}
        onFilterChange={filterChange2}

        skip={page2.skip}
        take={page2.take}
        total={total2}

        reorderable={true}
        resizable={true}

        onColumnReorder={handleColumnReorder2}
        onColumnResize={onColumnResize2}
      >
        {cols2.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
        ))}
      </Grid>
    </div>
    </DrawerContainer>
  );
  
};

export default ttcustDataGrid;
