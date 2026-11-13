import { WEATHER_CODES } from "../data/data.js"

const apikey = "9dbf374754415e359032046025f50dd6"
const form = document.getElementById("form")
const villechoisi = document.getElementById("ville-input")
const card = document.getElementById("card")
const loading = document.getElementById("loading");
const previsionsContainer = document.getElementById("previsions");
let derniereVille = "";

form.addEventListener("submit", async event =>{
    event.preventDefault();

    const ville = villechoisi.value.trim();
    derniereVille = ville;

    if (ville){
        loading.classList.remove("hidden");

        card.classList.add("hidden");
        previsionsContainer.classList.add("hidden");

        try {
            const data = await getweatherdata(ville);
            displayweather(data);

            const previsions = await getprevisions(ville);
            displayprevisions(previsions);
        } 
        
        catch (error){
            console.error(error);
            
              if (error instanceof TypeError) {
        displayerror("Erreur de connexion. Vérifiez votre connexion Internet.");
    } else {
        displayerror(error.message);
    }
            

        }
         finally{
            loading.classList.add("hidden");
        }
    } 
    else{
        displayerror("Veuillez entrer une ville valide");
    }
});


async function getweatherdata(ville){

 const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apikey}&units=metric&lang=fr`;

 const response = await fetch(url)
 
 if(! response.ok){

    if (response.status === 404){
        throw new Error("Ville introuvable");

    }
    else if (response.status === 429){
        throw new Error("Limite de requêtes atteinte");

    } 
    else if (response.status >= 500){
        throw new Error("Service météo indisponible");

    } 
else{
        throw new Error("Une erreur est survenue");
}
}
return await response.json();
}
   



function displayweather(data) {
 
    card.classList.remove("hidden")

    const {name: ville,
           main: { temp, humidity, temp_max, temp_min, pressure },
           weather: [{ description, id }], 
           wind: {speed},
           sys:{country}
           } = data;
    card.textContent = ""
    card.classList.add("flex");

   const villedisplay = document.createElement("h1");
   const tempdisplay = document.createElement("p");
   const humiditydisplay = document.createElement("p");
   const descriptiondisplay = document.createElement("p");
   const emojidisplay = document.createElement("p");
   const windspeed = document.createElement("p");
   const max = document.createElement("p");
   const min = document.createElement("p");
   const pressuredisplay = document.createElement("p");
   const countrydisplay = document.createElement("p")

   villedisplay.textContent = ville;
   card.appendChild(villedisplay);

   tempdisplay.textContent = `${temp}°C`;
   card.appendChild(tempdisplay);

   humiditydisplay.textContent = `humidity: ${humidity}%`;
   card.appendChild(humiditydisplay);

   descriptiondisplay.textContent = description;
   card.appendChild(descriptiondisplay);

   windspeed.textContent = `${(speed *3.6).toFixed(2)} Km/h`;
   card.appendChild(windspeed);

   max.textContent = `max : ${temp_max}°C`;
   card.appendChild(max);

   min.textContent= `min : ${temp_min}°C`;
   card.appendChild(min);

   pressuredisplay.textContent = `${pressure}mbar`;
   card.appendChild(pressuredisplay);

   countrydisplay.textContent = country;
   card.appendChild(countrydisplay);

   const weather = WEATHER_CODES[id];

    const icon = weather ? weather.icon : "";

    emojidisplay.textContent = icon;
    card.appendChild(emojidisplay);


villedisplay.className = "text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2 text-[50px]";

countrydisplay.className = "text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-1.5 rounded-md -mt-1 text-[20px]";

emojidisplay.className = "text-7xl my-1 drop-shadow-md";

tempdisplay.className = "text-6xl font-black tracking-tighter text-blue-600 my-1";

descriptiondisplay.className = "text-base font-bold  capitalize text-[25px] bg-blue-50 px-3 py-1.5 rounded-full border border-red-100";

max.className = "text-xs font-medium text-slate-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100";

min.className = "text-xs font-medium text-slate-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100";

humiditydisplay.className = "text-xs font-bold text-slate-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 text-[25px]";

windspeed.className = "text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200";

pressuredisplay.className = "text-xs font-medium text-slate-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100";



console.log(data);

}


function displayerror(message) {
    previsionsContainer.classList.add("hidden");
    
    card.classList.remove("hidden");
    card.classList.remove("flex");
    
    const errordisplay = document.createElement("p");
    errordisplay.textContent = message;
    
    card.textContent = "";
    card.appendChild(errordisplay);
    
    errordisplay.className = "text-red-600 font-semibold text-center";

    const reessayerButton = document.createElement("button");

    reessayerButton.textContent = "Réessayer";

    reessayerButton.addEventListener("click", () => {
    villechoisi.value = derniereVille;
    form.requestSubmit();

}
)
    card.appendChild(reessayerButton);
    reessayerButton.classList = "bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer flex justify-center";
}


async function getprevisions(ville){
    
    const preurl = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apikey}&units=metric&lang=fr`

     const response = await fetch(preurl)
 
   if(! response.ok){

    if (response.status === 404) {
        throw new Error("Ville introuvable");

    }
    else if (response.status === 429) {
        throw new Error("Limite de requêtes atteinte");

    } 
    else if (response.status >= 500) {
        throw new Error("Service météo indisponible");

    } 
else {
        throw new Error("Une erreur est survenue");
}
}
    return await response.json();
}



function displayprevisions(data){

const preTitel = document.getElementById("previsionsTitel")
preTitel.classList.remove("hidden")

    console.log(data);
    

    previsionsContainer.textContent=""

    previsionsContainer.classList.remove("hidden")
        
const dates = [];

data.list.forEach(prevision => {

    const date = prevision.dt_txt.split(" ")[0];

    if (!dates.includes(date)) {

        dates.push(date);

        const {
            dt_txt,
            main: { temp, temp_min, temp_max },
            weather: [{ id }]
        } = prevision;

        const weather = WEATHER_CODES[id];
        const icon = weather ? weather.icon : "";

         const precard = document.createElement("div");
    precard.className = "bg-white/90 rounded-2xl p-5 shadow-lg flex flex-col items-center gap-3";

    const dateobj = new Date(dt_txt);
        const options = { 
            weekday: 'long',  
            day: 'numeric', 
            month: 'long'    
        };

     const dateDisplay = document.createElement("p");
    dateDisplay.textContent = dateobj.toLocaleDateString("fr-FR", options);

    
    const iconDisplay = document.createElement("p");
    iconDisplay.textContent = icon;

   
    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;

    const minDisplay = document.createElement("p")
    minDisplay.textContent = `Min : ${temp_min}°C`

    const maxDisplay = document.createElement("p")
    maxDisplay.textContent = `Max : ${temp_max}°C`

    
    precard.appendChild(dateDisplay);
    precard.appendChild(iconDisplay);
    precard.appendChild(tempDisplay);
    precard.appendChild(minDisplay);
    precard.appendChild(maxDisplay);

    minDisplay.className = "text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full";

    maxDisplay.className = "text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full";

    tempDisplay.className = "font-bold font-black tracking-tighter text-blue-600 my-1 text-[25px]"

    iconDisplay.className = "my-1 drop-shadow-md text-[40px]"

    dateDisplay.className = "font-bold"


      

        
        previsionsContainer.appendChild(precard);
    }

});
}
