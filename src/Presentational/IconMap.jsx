import { Icon, Point } from 'leaflet'
import icon from '../../images/icon-location.svg'

const iconPerson = new Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconSize: new Point(30, 40),
});

export { iconPerson }