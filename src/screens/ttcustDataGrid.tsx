import { useState, useEffect } from 'react'
import {Grid, GridColumn, GridPageChangeEvent} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { PagerTargetEvent } from '@progress/kendo-react-data-tools';

//import './App.css'

const url = 'http://localhost:8080/jttcust'
const colooUrl = 'http://localhost:8080/coloo'

//column Id is: custData

interface SEQ_Data{
  custID: string;
  seqPre: string;
  seqNum: number;
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
const initialDataState: PageState = { skip: 0, take: 15 };
const initialColumns = [
  { field: "customer", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "bill-to-city", title: "City", orderIndex: 1, width: '120px' },
  { field: "bill-to-state", title: "State", orderIndex: 2, width: '200px' },
  { field: "NAME", title: "Customer Name", orderIndex: 3, width: '400px' },
  ];

const initialData2Columns = [
  { field: "custId", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "seqPre", title: "SEQ-PRE", orderIndex: 1, width: '150px'},
  { field: "seqNum", title: "SEQ-NUM", orderIndex: 2, width: "150px"},
]


const ttcustDataGrid : React.FC = () => {
  const { id } = useParams()
  const userId = id as string;
  const navigate = useNavigate()

  const [page, setPage] = useState<PageState>(initialDataState);
  const [pageSizeValue, setPageSizeValue] = useState<number | string | undefined>();

  const [data2, setData2] = useState<SEQ_Data[]>([]);
  const [cols, setCols] = useState<column[]>(initialColumns);
  const [cols2, setCols2] = useState<column[]>(initialData2Columns)
  const [custs, setCusts] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCusts = async () => {
      try {
        const response = await
        fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Customer[] = await response.json();
        //console.log(data)
        setCusts(data)
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCusts();
  }, []);

  //const data = process(products, { skip: page.skip, take: page.take });

  const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        const take = targetEvent.value === 'All' ? custs.length : event.page.take;
        console.log(event)
        if (targetEvent.value) {
            setPageSizeValue(targetEvent.value);
        }
        setPage({
            ...event.page,
            take
        });
    };


  

  

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
          const response2 = await fetch('http://localhost:8080/coloo', {
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
          const response2 = await fetch('http://localhost:8080/coloo', {
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
    // console.log(` new width: ${event.newWidth}`);
    // console.log(event.index);
    // console.log(cols)
    const newCols = cols;
    newCols.forEach( (element) => {
      if (element.orderIndex == event.index){
        element.width = event.newWidth;
      }
    })
    //console.log(newCols);
    const updateColumns = async () => {
      const responseUpdate = await fetch("http://localhost:8080/coloo", {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "custData", "dataColumns": newCols as column[]})
      });
      setCols(newCols);
      //console.log(responseUpdate);
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
    //console.log(newCols);
    const updateColumns = async () => {
      const responseUpdate = await fetch("http://localhost:8080/coloo", {
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
    //console.log("COlUMNS CHANGED ORDER")
    //const test = reorderedColumns as column[]
    //console.log(test[0].width)
    const updateColumns = async () => {
      const responseUpdate = await fetch("http://localhost:8080/coloo", {
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
    //console.log("COlUMNS CHANGED ORDER")
    //console.log(reorderedColumns as column[])
    const updateColumns = async () => {
      const responseUpdate = await fetch("http://localhost:8080/coloo", {
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
    // console.log(event.dataItem)
    // console.log(dataItem.customer)
    const addDataToSecondGraph = async () => {
      try {
        const response = await fetch("http://localhost:8080/jttcust/seqData/" + dataItem.customer)
        if (!response.ok){
          throw new Error(`Error: ${response.statusText}`); 
        }
        const result : SEQ_Data[] = await response.json()
        setData2(result);
      } catch (error) {
        console.log(error)
      } 
    }
    addDataToSecondGraph();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>Customers</h1>
      <Grid
        style={{ height: '700px'}} 
        data={custs}
        dataItemKey='customer' 
        sortable={true}
        autoProcessData={true}
        
        filterable={true}

        skip={page.skip}
        take={page.take}
        total={custs.length}
        
        reorderable={true}
        resizable={true}

        pageable={{
          buttonCount: 4,
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
        dataItemKey='customer'
        sortable={true}
        autoProcessData={true}
        pageable={true}
        filterable={true}
        defaultSkip={0}
        defaultTake={15}
        reorderable={true}
        resizable={true}
        onColumnReorder={handleColumnReorder2}
        onColumnResize={onColumnResize2}
      >
        {cols2.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
        ))}
      </Grid>
      <Button onClick = {() => navigate("/")}> Logout </Button>
    </div>
  );
  
};

export default ttcustDataGrid;
