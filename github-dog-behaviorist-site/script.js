// Dog Behaviourist Melbourne - Main JavaScript

// Trainer data - hardcoded for simplicity
const trainers = [
    {
        id: 1,
        name: "Emma Wilson",
        location: "South Melbourne",
        address: "123 Park Street, South Melbourne",
        phone: "(03) 9123 4567",
        specialties: ["Reactive Dogs", "Puppy Training", "Separation Anxiety"],
        description: "Certified dog behaviorist with 10+ years of experience working with reactive dogs.",
        featured: true,
        forReactiveDogs: true,
        position: { lat: -37.831, lng: 144.963 }
    },
    {
        id: 2,
        name: "James Thompson",
        location: "Richmond",
        address: "45 Swan Street, Richmond",
        phone: "(03) 9876 5432",
        specialties: ["Basic Obedience", "Leash Training"],
        description: "Specializing in basic obedience and leash training for all dog breeds.",
        featured: false,
        forReactiveDogs: false,
        position: { lat: -37.823, lng: 144.998 }
    },
    {
        id: 3,
        name: "Sarah Chen",
        location: "Carlton",
        address: "78 Lygon Street, Carlton",
        phone: "(03) 9555 1234",
        specialties: ["Reactive Dogs", "Aggression Management", "Rescue Dogs"],
        description: "Expert in working with rescue dogs and managing aggression issues.",
        featured: false,
        forReactiveDogs: true,
        position: { lat: -37.797, lng: 144.969 }
    },
    {
        id: 4,
        name: "Michael Rodriguez",
        location: "St Kilda",
        address: "22 Acland Street, St Kilda",
        phone: "(03) 9333 7890",
        specialties: ["Puppy Training", "Socialization"],
        description: "Specializing in early puppy development and socialization techniques.",
        featured: false,
        forReactiveDogs: false,
        position: { lat: -37.868, lng: 144.981 }
    },
    {
        id: 5,
        name: "Olivia Parker",
        location: "Brunswick",
        address: "156 Sydney Road, Brunswick",
        phone: "(03) 9444 5678",
        specialties: ["Reactive Dogs", "Anxiety Management", "Behavioral Modification"],
        description: "Certified in treating anxiety and fear-based behaviors in dogs.",
        featured: false,
        forReactiveDogs: true,
        position: { lat: -37.775, lng: 144.962 }
    }
];

// Global variables
let map;
let markers = [];
let infoWindows = [];
let currentInfoWindow = null;

// Initialize the map
function initMap() {
    // Center map on Melbourne
    const melbourne = { lat: -37.814, lng: 144.963 };
    
    // Create the map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: melbourne,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
    });
    
    // Add markers for each trainer
    trainers.forEach(trainer => {
        addTrainerMarker(trainer);
    });
    
    // Populate the trainers list
    populateTrainersList();
    
    // Display the featured trainer
    displayFeaturedTrainer();
}

// Add a marker for a trainer
function addTrainerMarker(trainer) {
    const marker = new google.maps.Marker({
        position: trainer.position,
        map: map,
        title: trainer.name,
        animation: trainer.featured ? google.maps.Animation.BOUNCE : null
    });
    
    // Create info window content
    const contentString = `
        <div class="info-window">
            <h5>${trainer.name}</h5>
            <p><strong>Location:</strong> ${trainer.location}</p>
            <p><strong>Address:</strong> ${trainer.address}</p>
            <p><strong>Phone:</strong> ${trainer.phone}</p>
            <p><strong>Specialties:</strong> ${trainer.specialties.join(", ")}</p>
            ${trainer.forReactiveDogs ? '<p><span class="badge-reactive">Reactive Dogs</span></p>' : ''}
            <p>${trainer.description}</p>
        </div>
    `;
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 300
    });
    
    // Add click event to marker
    marker.addListener("click", () => {
        // Close currently open info window
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }
        
        // Open this info window
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
        
        // Center map on marker
        map.setCenter(trainer.position);
    });
    
    // Store marker and info window
    markers.push({ marker, trainer });
    infoWindows.push(infoWindow);
}

// Populate the trainers list in the sidebar
function populateTrainersList() {
    const trainersListElement = document.getElementById("trainersList");
    trainersListElement.innerHTML = "";
    
    trainers.forEach(trainer => {
        const trainerCard = document.createElement("div");
        trainerCard.className = `card trainer-card ${trainer.id}`;
        if (trainer.featured) {
            trainerCard.classList.add("featured-card");
        }
        
        trainerCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${trainer.name}
                    ${trainer.forReactiveDogs ? '<span class="badge-reactive">Reactive Dogs</span>' : ''}
                </h5>
                <p class="card-text"><strong>Location:</strong> ${trainer.location}</p>
                <p class="card-text"><small>${trainer.specialties.join(", ")}</small></p>
            </div>
        `;
        
        // Add click event to card
        trainerCard.addEventListener("click", () => {
            // Find the corresponding marker
            const markerInfo = markers.find(m => m.trainer.id === trainer.id);
            
            // Trigger the marker click event
            if (markerInfo) {
                google.maps.event.trigger(markerInfo.marker, "click");
            }
        });
        
        // Add data attribute for filtering
        trainerCard.dataset.reactive = trainer.forReactiveDogs;
        
        trainersListElement.appendChild(trainerCard);
    });
}

// Display the featured trainer
function displayFeaturedTrainer() {
    const featuredTrainer = trainers.find(trainer => trainer.featured);
    const featuredTrainerElement = document.getElementById("featuredTrainer");
    
    if (featuredTrainer) {
        featuredTrainerElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${featuredTrainer.name}
                    ${featuredTrainer.forReactiveDogs ? '<span class="badge-reactive">Reactive Dogs</span>' : ''}
                </h5>
                <p class="card-text"><strong>Location:</strong> ${featuredTrainer.location}</p>
                <p class="card-text">${featuredTrainer.description}</p>
                <p class="card-text"><small>${featuredTrainer.specialties.join(", ")}</small></p>
            </div>
        `;
        
        // Add click event to featured trainer card
        featuredTrainerElement.addEventListener("click", () => {
            // Find the corresponding marker
            const markerInfo = markers.find(m => m.trainer.id === featuredTrainer.id);
            
            // Trigger the marker click event
            if (markerInfo) {
                google.maps.event.trigger(markerInfo.marker, "click");
            }
        });
    } else {
        featuredTrainerElement.innerHTML = "<p>No featured trainer available</p>";
    }
}

// Filter trainers for reactive dogs
function filterReactiveDogs() {
    const reactiveDogsFilter = document.getElementById("reactiveDogsFilter");
    const showOnlyReactive = reactiveDogsFilter.checked;
    
    // Filter markers on the map
    markers.forEach(({ marker, trainer }) => {
        if (showOnlyReactive && !trainer.forReactiveDogs) {
            marker.setMap(null); // Hide marker
        } else {
            marker.setMap(map); // Show marker
        }
    });
    
    // Filter trainer cards in the list
    const trainerCards = document.querySelectorAll(".trainer-card");
    trainerCards.forEach(card => {
        const isReactive = card.dataset.reactive === "true";
        if (showOnlyReactive && !isReactive) {
            card.classList.add("hidden");
        } else {
            card.classList.remove("hidden");
        }
    });
}

// Handle Google Maps API errors
function handleMapError() {
    document.getElementById("map").innerHTML = `
        <div class="alert alert-danger">
            <h4>Map Loading Error</h4>
            <p>There was an error loading the Google Maps. Please check your API key and try again.</p>
        </div>
    `;
}

// Initialize the map when the window loads
window.onload = function() {
    // The initMap function will be called by the Google Maps API
    // If there's an error, call the error handler
    if (typeof google === 'undefined') {
        handleMapError();
    }
};
