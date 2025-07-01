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
            <h1>Home Screen</h1>
        </div>
        </DrawerContainer>
    );
}

export default Home;