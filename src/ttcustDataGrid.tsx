import { useState, useEffect } from 'react'
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";

//import './App.css'

const url = 'http://localhost:8080/jttcust'
const colooUrl = 'http://localhost:8080/coloo'
const userId = 'IMS'
//column Id is: custData


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
const initialColumns = [
  { field: "customer", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "bill-to-city", title: "City", orderIndex: 1, width: '120px' },
  { field: "bill-to-state", title: "State", orderIndex: 2, width: '200px' },
  { field: "NAME", title: "Customer Name", orderIndex: 3, width: '400px' },
  ];



const ttcustDataGrid = () => {

  const [cols, setCols] = useState<column[]>(initialColumns);
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

  

  

  

  useEffect(() => {
    const fetchCols = async () => {
      try {
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
            body: JSON.stringify({"userId":userId,"columnId":"custData","dataColumns":[{"field":"customer","title":"Customer ID","orderIndex":0,"width":"150px"},{"field":"bill-to-city","title":"City","orderIndex":2,"width":"120px"},{"field":"bill-to-state","title":"State","orderIndex":3,"width":"200px"},{"field":"NAME","title":"Customer Name","orderIndex":1,"width":"400px"}]}),
          });
          const result = await response2.json();
          console.log(result)
        }

          const result : column[] = await response.json()
          setCols(result)
      } catch (error){
        console.error("Error fetching data:", error);

      } finally {
      }
    }
    fetchCols();
  }, []);

  

  const handleColumnReorder = (event: { columns: any; }) => {
    const reorderedColumns = event.columns;
    console.log("COlUMNS CHANGED ORDER")
    console.log(reorderedColumns as column[])
    const updateColumns = async () => {
      const responseUpdate = await fetch("http://localhost:8080/coloo", {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
              },
        body: JSON.stringify({"userId": userId, "columnId": "custData", "dataColumns": reorderedColumns as column[]})
      });
      console.log(responseUpdate);
    }
    updateColumns();
    //setCols(reorderedColumns);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>Customers</h1>
      <Grid
        style={{ height: '800px'}} 
        data={custs}
        dataItemKey='customer' 
        sortable={true}
        autoProcessData={true}
        pageable={true}
        filterable={true}
        skip={0}
        take={15}
        reorderable={true}
        resizable={true}
        onColumnReorder={handleColumnReorder}
        
        >
        {cols.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
        ))}
      </Grid>
      
    </div>
  );
  
};

export default ttcustDataGrid;
