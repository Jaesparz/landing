import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);



let saveVotes = (productId) =>{

    const votesRef = ref(database, 'votes');
    const newVoteRef = push(votesRef);

    return set(newVoteRef,{
        productId: productId,
        timestamp: Date.now()
    }).then ( () =>{
        return {
            status: true,
            message: 'vote succesfully'
        }
    }

    ).catch((error) =>{

    console.error("Error saving vote: ",error);
    return {
        status: false,
        message: "error saving vote"
    } 
} );
}

let getVotes = async () => {
  try {
    const votesRef = ref(database, "votes");
    const snapshot = await get(votesRef);
    if (snapshot.exists()) {
      return { status: true, data: snapshot.val() };
    } else {
      return { status: false, message: "No hay datos de votos." };
    }
  } catch (error) {
    console.error("Error obteniendo votos:", error);
    return { status: false, message: error?.message || "Error obteniendo votos." };
  }
};

export {saveVotes, getVotes}