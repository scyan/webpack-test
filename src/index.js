import './index.css';
import feMonitor from './monitor.js';
export default class My{
  constructor(){}
}
window.navigator.sendBeacon=0
feMonitor.setConfig({
  line:"111",
  project:'222'
})
feMonitor.reportEvent({eventId:'123'})

let xmlhttp=new XMLHttpRequest();
 xmlhttp.onreadystatechange=function(){
  console.log(xmlhttp.readyState,'??????')
 };
  xmlhttp.open("GET",'https://easy-mock.com/mock/5c5918545b9f6b29545faf8d/project/config',true);
  xmlhttp.send(null);

