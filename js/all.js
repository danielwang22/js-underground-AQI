//DOM
const citySelector = document.querySelector('#city-selector');
const city = document.querySelector('#city');
const updateTime = document.querySelector('.update-time');
const mainAqiTitle = document.querySelector('#main-aqi-title');
const mainAqiNumber = document.querySelector('#main-aqi-number');
const mainAqiTable = document.querySelector('#main-aqi-table');
const particle = document.querySelectorAll('.particle');
const townAqiCards = document.querySelector('.town-aqi-cards');
const townTitle = document.querySelectorAll('.town-aqi .town-aqi-title');
const townNumber = document.querySelectorAll('.town-aqi .town-aqi-number');

class Aqi{
    constructor(){
        this.setting = {
            url: 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?format=json',
            type: 'GET',
            contentType: "application/json",
            dataType:'jsonp',
        };
        this.ajax(this.setting);

        setInterval(()=>{
            this.ajax(this.setting);
        },3600000);
    }
    get getdata(){ return this.data }
    set setdata(val){ this.data = val }
    async ajax(setting) {
        try {
            var res = await $.ajax(setting);
        } catch (jqXHR) {
            console.error(jqXHR.statusText);
        }
        //console.log("finished");
        this.catchdata(res);
    }
    catchdata(data){
        this.setdata = data;
        this.countryoption();
    }
    countryoption(){
        let a = new Set();
        this.getdata.forEach((Element,index) =>{
            if(a.has(Element.County)){
                return
            }else{
                let option = document.createElement("option");
                option.innerText = Element.County;
                option.value = Element.County;
                citySelector.appendChild(option);
            }
            a.add(Element.County);
        })
        this.viewchange('高雄市');
    }
    viewchange(val){
        this.town = this.getdata.filter((Element,index,array) =>{
            return (Element.County == val);
        })

        this.mainAqichange(0);

        townAqiCards.innerHTML = '';

        for(let i = 0;i<this.town.length;i++){

            this.colorSelector(i);
            
            townAqiCards.innerHTML += `
            <div class="grid-3 town-aqi d-flex flex-row mb-3">
                <div class="w-50 town-aqi-title d-flex flex-row justify-content-center align-items-center bg-secondary font-size-md outline p-3">${this.town[i].SiteName}</div>
                <div class="w-50 town-aqi-number d-flex flex-row justify-content-center bg-${this.bgclass} font-size-lg text-center outline p-3">${this.town[i].AQI == '' ? 'none' : this.town[i].AQI}</div>
            </div>
            `
        }

        const TownAqiTitle = document.querySelectorAll('.town-aqi-title');
        TownAqiTitle.forEach((Element) =>{
            this.smallfont(Element);
        })

        this.colorSelector(0);
        mainAqiNumber.style.backgroundColor = this.bgcolor;
        this.smallfont(mainAqiTitle);
        

        const townAqi = document.querySelectorAll('.town-aqi');
        this.townSelect(townAqi);
        
    }
    changeview(address){
        this.town.forEach((Element,index) =>{
            if(Element.SiteName == address){

                this.mainAqichange(index)

                this.colorSelector(index);
                mainAqiNumber.style.backgroundColor = this.bgcolor;
                this.smallfont(mainAqiTitle)
            }
        })
    }
    smallfont(who){
        let len = who.textContent.length;
        if(len > 5 && len < 8){
            who.style.fontSize = '30px';
        }
        else if(len > 7){
            who.style.fontSize = '20px';
        }else{
            who.style.fontSize = '36px';
        }
    }
    mainAqichange(index){
        city.innerText = this.town[index].County;
        updateTime.innerText = this.town[index].PublishTime;
        mainAqiTitle.innerText = this.town[index].SiteName;
        mainAqiNumber.innerText = this.town[index].AQI == '' ? 'none' : this.town[index].AQI;
        particle[0].innerText = this.town[index].O3 == '' ? 'none' : this.town[index].O3;
        particle[1].innerText = this.town[index].PM10 == '' ? 'none' : this.town[index].PM10;
        particle[2].innerText = this.town[index]['PM2.5'] == '' ? 'none' : this.town[index]['PM2.5'];
        particle[3].innerText = this.town[index].CO == '' ? 'none' : this.town[index].CO;
        particle[4].innerText = this.town[index].SO2 == '' ? 'none' : this.town[index].SO2;
        particle[5].innerText = this.town[index].NO2 == '' ? 'none' : this.town[index].NO2;
    }
    colorSelector(index){
        let AQI = parseFloat(this.town[index].AQI);
        if(AQI < 51){
            this.bgclass = 'good'
            this.bgcolor = '#95F084'
        }else if(AQI > 50 || AQI < 101){
            this.bgclass = 'normal'
            this.bgcolor = '#FFE695'
        }else if(AQI > 100 || AQI < 151){
            this.bgclass = 'unhealth'
            this.bgcolor = '#FFAF6A'
        }else if(AQI > 150 || AQI < 201){
            this.bgclass = 'warning'
            this.bgcolor = '#FF5757'
        }else if(AQI > 200 || AQI < 301){
            this.bgclass = 'danger'
            this.bgcolor = '#9777FF'
        }else if(AQI > 300 || AQI < 401){
            this.bgclass = 'death'
            this.bgcolor = '#AD1774'
        }else{
            this.bgclass = 'secondary'
            this.bgcolor = 'white'
        }
    }
    townSelect(townAqi){
        townAqi.forEach((btn) =>{
            btn.addEventListener('click',() =>{
                console.log(btn.children[0].textContent);
                this.changeview(btn.children[0].textContent);
            },false)
        })
    }
}

const aqi = new Aqi();

citySelector.addEventListener('change',() =>{
    aqi.viewchange(citySelector.value);
},false);
