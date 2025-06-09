import { useState, useEffect } from 'react'
import {Grid, GridColumn as GridColumn} from '@progress/kendo-react-grid';
import "@progress/kendo-theme-default/dist/all.css";
//import './App.css'
const url = 'http://localhost:8080/jttcust'
interface Customer {
  custID: string;
  NAME?: string;
  billToCity?: string;
  billToState?: string;
}

const App: React.FC = () => {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const initialColumns = [
  { field: "customer", title: "Customer ID", orderIndex: 0, width: '150px'},
  { field: "bill-to-city", title: "City", orderIndex: 1, width: '120px' },
  { field: "bill-to-state", title: "State", orderIndex: 2, width: '200px' },
  { field: "NAME", title: "Customer Name", orderIndex: 3, width: '400px' },
  ];
  

  const handleColumnReorder = (event: { columns: any; }) => {
     const reorderedColumns = event.columns;
    console.log("COlUMNS CHANGED ORDER")
    console.log(reorderedColumns)
  };

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
        defaultSkip={0}
        defaultTake={15}
        reorderable={true}
        resizable={true}
        onColumnReorder={handleColumnReorder}
        
        >
        {initialColumns.map((col) => (
          <GridColumn key={col.field} field={col.field} title={col.title} orderIndex={col.orderIndex} width={col.width}></GridColumn>
        ))}
      </Grid>
    </div>
  );
  
};

export default App;
