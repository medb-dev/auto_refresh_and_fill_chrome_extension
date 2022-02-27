
//////////////
// Elements :
//////////////
const time_interval = document.querySelector('#refresh-time');
const btn_start = document.querySelector('#btn-start');
const btn_stop = document.querySelector('#btn-stop');
//// Advanced Options ::
const advancedOptions_checkBox = document.getElementById('toggle-advanced-options');
const advancedOptions = document.getElementById('advanced-options');
//// Form ::
const order_name = document.getElementById('order_billing_name');
const email = document.getElementById('order_email');
const telephone = document.getElementById('order_tel');
const address1 = document.getElementById('order_billing_address');
const address2 = document.getElementById('order_billing_address_2');
const city = document.getElementById('order_billing_city');
const state = document.getElementById('order_billing_state');
const country = document.getElementById('order_billing_country');
const zip = document.getElementById('order_billing_zip');
const card_number = document.getElementById('credit_card_number');
const month = document.getElementById('credit_card_month');
const year = document.getElementById('credit_card_year');
const cvv = document.getElementById('credit_card_verification_value');
//// Form Buttons ::
const auto_fill_btn = document.getElementById('auto-fill');
const load_btn = document.getElementById('load');
const save_btn = document.getElementById('save');
const clear_btn = document.getElementById('reset-fields');
//// Tab submition button
const submit = document.querySelector("input[name='commit'].checkout");
//////////////
// Variables :
//////////////
const LOCAL_STORAGE_KEY = "my_reservations"; 
var dataTable = [];
let show_advancedOptions;
let nIntervId;;
//////////////
// Events :
//////////////
window.addEventListener('load', (event) => { 
    advancedOptions.classList.add('hidden-adv')
    show_advancedOptions = false;
});

advancedOptions_checkBox.addEventListener('click',()=>{
    show_advancedOptions = !show_advancedOptions;
    if(!advancedOptions.classList.contains('hidden-adv'))
        advancedOptions.classList.add('hidden-adv')
    else 
        advancedOptions.classList.remove('hidden-adv')

});

auto_fill_btn.addEventListener("click", () => {
	/* Auto fill form */
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			name:       order_name.value,
			email:      email.value,
			telephone:  telephone.value,
			address1:   address1.value,
			address2:   address2.value,
			city:       city.value,
			state:      state.value,
			country:    country.value,
			zip:        zip.value,
			card_number:card_number.value,
			month:      month.value,
			year:       year.value,
			cvv:        cvv.value
		}, function(response) {
			console.log(response.status);
		});
	});
});

clear_btn.addEventListener("click", () => {
	order_name.value = '';
	email.value = '';
	telephone.value = '';
	address1.value = '';
	address2.value = '';
	city.value = '';
	state.value = '';
	country.value = '';
	zip.value = '';
	card_number.value = '';
	month.value = '';
	year.value = '';
	cvv.value = '';
});

save_btn.addEventListener("click", () => {
	chrome.storage.sync.set({
        name:       order_name.value,
        email:      email.value,
        telephone:  telephone.value,
        address1:   address1.value,
        address2:   address2.value,
        city:       city.value,
        state:      state.value,
        country:    country.value,
        zip:        zip.value,
        card_number:card_number.value,
        month:      month.value,
        year:       year.value,
        cvv:        cvv.value
	}, function() {
		console.log("Saved!");
	});
});

load_btn.addEventListener("click", () => {
	chrome.storage.sync.get([
		'name',
		'email',
		'telephone',
		'address1',
		'address2',
		'city',
		'state',
		'country',
		'zip',
		'card_number',
		'month',
		'year',
		'cvv'
	], function(result) {
        order_name.value    = result.name;
		email.value         = result.email;
		telephone.value     = result.telephone;
		address1.value      = result.address1;
		address2.value      = result.address2;
		city.value          = result.city;
		state.value         = result.state;
		country.value       = result.country;
		zip.value           = result.zip;
		card_number.value   = result.card_number;
		month.value         = result.month,
		year.value          = result.year,
		cvv.value           = result.cvv;
	});
});

btn_start.addEventListener('click', ()=>{
    let many_refreshs = 0;
    if( !nIntervId ){
        nIntervId = setInterval(()=>{
            if (document.readyState === "complete" || many_refreshs > 0) {
                    clearInterval(nIntervId); 
            }else{
                many_refreshs++;
                chrome.tabs.reload(function(){});
                let code = "many_refreshs : "+many_refreshs;
                chrome.tabs.executeScript({code: 'console.log(`hit`)'});
            }
        },time_interval.value*1000);
    }
});

btn_stop.addEventListener('click', ()=>{
    if (nIntervId)
        clearInterval(nIntervId); 
    nIntervId = null;
});

//////////////
// functions :
//////////////

function saveData(key,data){ 
    try {
        if(storageAvailable()){
            localStorage.setItem(key, JSON.stringify(data));
            console.log('data saved successfully!');
        }
    } catch (error) {console.error('Error:'+error);}
}

function loadData(key){ 
    try{
        if(storageAvailable()){
            const data =  JSON.parse(localStorage.getItem(key)); 
            console.log('data loaded successfully!');
            return data;
        }
    }catch(error){console.error('Error:'+error)}
    
}

function removeData(key,data){ 
    try {
        localStorage.removeItem(key); 
        data=[]; 
        console.log('data removed successfully!');
    } catch (error) {console.error('Error:'+error);}
}

function clearData(data){
    try {
        localStorage.clear(); 
        data=[]; 
        console.log('data cleared successfully!');
    } catch (error) {console.error('Error:'+error);}
}

function exportJson(filename, data) {
    try {
        var element = document.createElement('a');
        const text =  JSON.stringify(data);
        
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } catch (error) {console.error('Error:'+error);}
}

function importJson(filename){
    let table = []
    try {
        fetch(filename).then( response => response.json())
        .then( data =>  data.forEach((item) => table.push(item)) );
        return table;
    } catch (error) { console.error('Error:' + error); }
}

function storageAvailable() {
    var storage;
    try {
        storage = window['localStorage'];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (storage && storage.length !== 0);
        }
}

//  Only for Debuging :
function getJsonFileName(){
    console.log(document.getElementById('getFile').files[0]);
    console.log(document.getElementById('getFile').value);
    console.log((window.URL || window.webkitURL).createObjectURL(document.getElementById('getFile').files[0]));
}








    // window.addEventListener('load', (event) => {  
        // saveData(LOCAL_STORAGE_KEY,dataTable);
        // console.log(dataTable = loadData(LOCAL_STORAGE_KEY));
        // exportJson("backup.json",{name:'mohamed',age:20});
    // })
    
    
    // const input = document.getElementById('getFile');
    
    // const upload = (file) => {
    //   fetch('./', { 
    //     method: 'POST',
    //     headers: {
    //     //   "Content-Type": "Personal Informations.."
    //     },
    //     body: file
    //   }).then(
    //     response => response.json() 
    //   ).then(
    //     success => console.log(success) 
    //   ).catch(
    //     error => console.log(error) 
    //   );
    // };
    
    // const onSelectFile = () => upload(input.files[0]);
    
    // input.addEventListener('change', onSelectFile, false);
    