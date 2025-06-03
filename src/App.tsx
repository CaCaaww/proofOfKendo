import { useState, useEffect } from 'react'
import {Grid, GridColumn as Column, GridItemChangeEvent} from '@progress/kendo-react-grid';

import './App.css'
const url = 'http://localhost:8080/ttcust'
interface customer {
  customer?: string;
  NAME?: string;
  billToCity?: string;
  billToState?: string;
}

const App: React.FC = () => {
  const [custs, setCusts] = useState<customer[]>([]);
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
        const data: customer[] = await response.json();
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
      <ul>
        {custs.map((customer) => (
          <p key={customer.customer}>
            <h2>{customer.NAME}</h2>
            <p>{customer.billToCity}</p>
            <p>{customer.billToState}</p>
          </p>
        ))}
      </ul>
    </div>
  );
  
};

export default App;
