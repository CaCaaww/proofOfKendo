import {Grid, GridColumn as Column} from '@progress/kendo-react-grid';
import data2 from './ttcus.json';

import products from './ttcus.json';

const App = () => {
    return <Grid data={products}></Grid>;
};

export default App;
// export default function Home() {
//   return (
//     <Grid data={data2}></Grid>
//   )
// }
