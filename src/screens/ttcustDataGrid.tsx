import { useState, useEffect } from 'react'
import {Grid, GridColumn, GridFilterChangeEvent, GridPageChangeEvent, GridSortChangeEvent} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
import { useParams } from 'react-router-dom';
import { PagerTargetEvent } from '@progress/kendo-react-data-tools';
import DrawerContainer from './drawerContainer';
import { APP_API_URL } from '../environment';
//import './App.css'

const url = APP_API_URL + '/jttcust'
const colooUrl = APP_API_URL + '/coloo'

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

  

  // getting info for the different parts of the SQL query
  function getFilterInfo(filterInfo : filter | undefined) : string {
    var queryOptions = ""
    //make sure the filter is not undefined (is undefined if the user cancels the filter, as the event triggers and passes an undefined filter)
    if (filterInfo != undefined) {
      var filterField = filterInfo.field
      // the seq-num field is a number, and cannot use the 'LIKE %1%' stuff on it in SQL, so we need to case the **field** (not the number passed,
      // as it will be passed as a string by the ' ' anyways) to a string. 
      if (filterField == 'Seq-num'){
        filterField = "CAST(\"" + filterField + "\" AS VARCHAR(12))";
      } else {
        filterField = "\"" + filterField + "\"";
      }
      //a switch case to determine which keyword for matching to use, as different ones are required for different amounts of the total string that need to match
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
  // function to return the part of the SQL query that will mimic the paging, by selecting a subsection of the data to display.
  function getPageInfo(pageInfo : PageState) : string {
    const result = "OFFSET " + pageInfo.skip as string + " ROWS FETCH NEXT " + pageInfo.take as string + " ROWS ONLY ";
    return result;
  }
  // function to return the part of the SQL query that will sort the data. 
  function getSortInfo(sortInfo : [String, String | undefined]) : string {
    const result = "ORDER BY \"" + sortInfo[0] as string + "\" " + sortInfo[1] as string;
    return result;
  }

  //function to get the new total of customers. Used after the amount of data has been reduced.
  const fetchNewTotalWithOptions = async(options: string) => {
     try {
      // fetch the number of data
      const response = await fetch(url + "/custData/total/" + options);
      if (!response.ok) { //throw an error if the API doesn't return an httpstatus of OK
          throw new Error(`Error: ${response.statusText}`);
        }
      // set the total const
      const newTotal = await response.json()
      setTotal(newTotal);
    } catch (err){
      setError((err as Error).message);
    }
  }

  //function to get the new total of seqData. Used after the amount of data has been reduced.
  const fetchNewSeqTotalWithOptions = async(options: string) => {
     try {
      // fetch the number of data
      const response = await fetch(url + "/seqData/total/" + options);
      if (!response.ok) { //throw an error if the API doesn't return an httpstatus of OK
          throw new Error(`Error: ${response.statusText}`);
        }
      // set the total const
      const newTotal = await response.json()
      setTotal2(newTotal);
    } catch (err){
      setError((err as Error).message);
    }
  }

  //function to run the SQL query with the parameters to mimic the paging and additional features of the customer data.
  const fetchCustsWithSQL = async(options : string) => {
    try {
      // fetching the data
      const response = await fetch(url + "/sql/custData/" + options);
      if (!response.ok) { //throw an error if the API doesn't return an httpstatus of OK
          throw new Error(`Error: ${response.statusText}`);
        }
      // setting the data constant
      const data: Customer[] = await response.json();
      setCusts(data)
    } catch (err){
      setError((err as Error).message);
    }
  }

  //function to run an SQL query with parameters to mimic the paging and additional features of the seqData.
  const fetchSeqWithSQL = async(options : string) => {
    try {
      // fetching the data
      const response = await fetch(url + "/sql/seqData/" + options);
      if (!response.ok) { //throw an error if the API doesn't return an httpstatus of OK
          throw new Error(`Error: ${response.statusText}`);
        }
      // setting the data constant
      const newData2: SEQ_Data[] = await response.json();
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
      // adding the sortInfo to the query by calling the getSortInfo, but **passing the new data into it instead of the sort constant** because the sort constant
      // does not update -- for whatever reason -- before this is called. 
      queryOptions += getSortInfo([evsort[0].field, evsort[0].dir]);
      //queryOptions += " ORDER BY \"" + evsort[0].field + "\" " + evsort[0].dir;
    } else {
      setSort(
        ["Customer", "asc"]
      )
      queryOptions += " ORDER BY Customer asc";
    }
    //sorting the data does not change the amount of data, so it does not try fetching a new total.
    queryOptions += " " + getPageInfo(page);
    fetchCustsWithSQL(queryOptions);
  }

  const sortChange2 = (event: GridSortChangeEvent) => {
    console.log(event);
    const evsort = ({...event.sort})
    var queryOptions = "";
    var filterInfo = getFilterInfo(filter2);
        var queryOptions = "";
        // have to add an additional part to the filter because this data is already filtered by a certain customer.
        if (filterInfo === "") {
          queryOptions += "WHERE \"Customer\" = \'" + clickedCustomer + "\' "  
        } else {
          queryOptions += filterInfo + " AND \"Customer\" = \'" + clickedCustomer + "\' "
        }
    if (evsort[0] != undefined){
      setSort2(
        [evsort[0].field, evsort[0].dir]
      );
      queryOptions += getSortInfo([evsort[0].field, evsort[0].dir]);
      //queryOptions += " ORDER BY \"" + evsort[0].field + "\" " + evsort[0].dir;
    } else {
      setSort2(
        ["Customer", "asc"]
      )
      queryOptions += " ORDER BY Customer asc";
    }
    // does not need to fetch a new total because the size of the data is not being changed. 
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
      queryOptions += getFilterInfo(filt)
    } else {
      setFilter(
        undefined
      );
      queryOptions+= "WHERE 1=1"
    }
    // size of data is being changed and as such the data needs to be recounted.
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
      queryOptions += getFilterInfo(filt);
    } else {
      setFilter2(
        undefined
      );
      queryOptions+= "WHERE 1=1"
    }
    // add an additional part to the filter because the data was initially filtered.
    queryOptions += " AND \"Customer\" = \'" + clickedCustomer + "\'";
    // data size is changing and thus it needs to be recounted.
    fetchNewSeqTotalWithOptions(queryOptions)
    queryOptions += ' ' + getSortInfo(sort2) + ' ' + getPageInfo(page2)
    fetchSeqWithSQL(queryOptions);
  }

  //function to handle page changes
  const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        // a possibility that triggers the event is that the number of elements per page has changed. Thus we need to regrab the page number
        var take = event.page.take;
        if (targetEvent.value === 'All'){ //if the page is all, we need to set it to the total.
          take = total;
        }
        console.log(event)
        if (targetEvent.value) { // setting the new stored value.
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
          queryOptions += getFilterInfo(filter) + " " + getSortInfo(sort) + " " + getPageInfo({skip: newSkip, take :newPage} as PageState);
        }
        fetchCustsWithSQL(queryOptions);
    };

    const pageChange2 = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        // a possibility that triggers the event is that the number of elements per page has changed. Thus we need to regrab the page number        
        var take = event.page.take;
        if (targetEvent.value === 'All'){ // if the page is all, we need to set it to the total.
          take = total;
        }
        console.log(event)
        if (targetEvent.value) { // setting the new stored value.
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
          queryOptions += getPageInfo({skip: newSkip, take: newPage} as PageState);
        }
        fetchSeqWithSQL(queryOptions);
    };

    //if the column is resized, we store the value of its resize so that it will open to being in that size. 
    const onColumnResize = (event: any) => {
      const newCols = cols;
      newCols.forEach( (element) => {
        if (element.orderIndex == event.index){
          element.width = event.newWidth; //make sure to specify that it's using the newWidth. Event.width uses
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
  }

  //fetching the total number of data items for the jttcust grid.
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
  
  //fetching the customer data
  useEffect(() => {
    const fetchCusts = async () => {
      try {
        fetchCustsWithSQL(getPageInfo(page));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCusts();
  }, []);

  //fetching the data that says gives the ordering and info for the column.
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
