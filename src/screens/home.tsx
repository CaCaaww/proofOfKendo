import { AppBar, AppBarSection, AppBarSpacer, Avatar, Menu, MenuItem, PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { Switch, SwitchChangeEvent } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import { menuIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate, useParams } from 'react-router-dom';
import "@progress/kendo-theme-default/dist/all.css";
import DrawerContainer from './drawerContainer';



function Home() {
    const { id } = useParams()
    const userId = id as string;
    const navigate = useNavigate();
    
    const goToHomePage = (userID : string) => {
        console.log("going to Home page with userId: " + userID)
        navigate('/home/' + userID); 
    };

    const goToDataPage = (userId : string) => {
        console.log("going to data page with userId: " + userId);
        navigate('/data/' + userId);
    }

    const logout = () => {
        console.log("Logging Out");
        navigate('/');
    }


//<Button type="button" fillMode="flat" svgIcon={menuIcon} onClick={() => goToHomePage(userId)} />

    return (
        <DrawerContainer>
        <div>
            <Button > Go to Data </Button>
        </div>
        </DrawerContainer>
    );
}

export default Home;