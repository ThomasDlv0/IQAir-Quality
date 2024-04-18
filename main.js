const pollutionScale = [
    {
        scale: [0, 50],
        quality: "Bien",
        src: "happy",
        background: "green"
    },
    {
        scale: [51, 100],
        quality: "Modérer",
        src: "thinking",
        background: "yellow"
    },
    {
        scale: [101, 150],
        quality: "mauvais pour la santé",
        src: "unhealthy",
        background: "Orange"
    },
    {
        scale: [151, 200],
        quality: "Mauvais",
        src: "bad",
        background: "red"
    },
    {
        scale: [201, 300],
        quality: "Vraiment Mauvais",
        src: "mask",
        background: "Violet"
    },
    {
        scale: [301, 500],
        quality: "Terrible",
        src: "terrible",
        background: "red"
    },
]


const loader = document.querySelector(".loader");
const emojiLogo = document.querySelector(".emoji-logo");
const userInformation = document.querySelector(".user-information");


async function getPollutionData() {

    try {
        const response = await fetch("https://api.airvisual.com/v2/nearest_city?key=998df26f-40c6-4dd1-80e4-f81af2032a65").catch(error => {
            throw new Error(error)
        })

        console.log(response)

        if (!response.ok){
            throw new Error(`Error ${response.status}, ${response.statusText}`)
        }

        const responseData = await response.json();
        const aqi = responseData.data.current.pollution.aqius;
        console.log(responseData);

        const sortedData = {
            city: responseData.data.city,
            aqi,
            ...pollutionScale.find(obj => aqi >= obj.scale[0] && aqi <= obj.scale[1]),
        }
        populateUI(sortedData);
    } catch (error) {
        loader.classList.remove("active");
        emojiLogo.src = "./public/browser.svg";
        userInformation.textContent = error.message;
    }

}

getPollutionData()


const cityName = document.querySelector(".city-name");
const pollutionInfo = document.querySelector(".pollution-info");
const pollutionValue = document.querySelector(".pollution-value");
const backgroundLayer = document.querySelector(".background-layer");

function populateUI(data) {
    emojiLogo.src = `public/${data.src}.svg`;
    userInformation.textContent = `Voici la ville de ${data.city}`;
    cityName.textContent = data.city;
    pollutionInfo.textContent = data.quality;
    pollutionValue.textContent = data.aqi;
    backgroundLayer.style.backgroundColor = data.background;
    loader.classList.remove("active");

    pointerPlacement(data.aqi)
}


const locationPointer = document.querySelector(".location-pointer");

function pointerPlacement(AQIValue) {
    const parentWidth = locationPointer.parentElement.scrollWidth;
    locationPointer.style.transform = `translateX(${(AQIValue / 500) * parentWidth}px) rotate(180g)`;
}

