
import { useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerSelectEvent } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { menuIcon } from '@progress/kendo-svg-icons';
import { useLocation } from 'react-router-dom';



const DrawerContainer = (props: { children: unknown; }) => {
    const { id } = useParams()

    const items = [
    { text: 'Home', route: '/home/' + id },
    { text: 'Customer Data', route: '/data/' + id },
    { text: 'IAU Data', route: '/iauData/' + id},
    { separator: true },
    { text: 'Logout', disabled: false,  route: '/' },
    ];
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState<boolean>(true);
    const [selected, setSelected] = useState(items.findIndex((x) => x.route === useLocation().pathname));

    

    const handleClick = () => {
        setExpanded(!expanded);
    };

    const onSelect = (e: DrawerSelectEvent) => {
        navigate(e.itemTarget.props.route);
        setSelected(e.itemIndex);
    };


    return (
        <div>
            <div className="custom-toolbar">
                <Button svgIcon={menuIcon} fillMode="flat" onClick={handleClick} />
                <span className="title"></span>
            </div>
            <Drawer
                expanded={expanded}
                position={'start'}
                mode={'push'}
                width={150}
                items={items.map((item, index) => ({
                    ...item,
                    selected: index === selected
                }))}
                onSelect={onSelect}
            >
                <DrawerContent>{props.children}</DrawerContent>
            </Drawer>
        </div>
    );

};
export default DrawerContainer;