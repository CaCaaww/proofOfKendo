import { useState, useEffect } from 'react'
import {Grid, GridColumn as Column, GridItemChangeEvent, GridColumn} from '@progress/kendo-react-grid';

import './App.css'
const url = 'http://localhost:8080/ttcust'
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

  return (
    <div>
      <h1>Customers</h1>
      <Grid data={custs}>
        <GridColumn field="customer"/>
        <GridColumn field="bill-to-city"/>
        <GridColumn field="bill-to-state"/>
        <GridColumn field="NAME"/>
      </Grid>
    </div>
  );
  
};

export default App;
