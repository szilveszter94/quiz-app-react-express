/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  prompt: "select_account",
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();

export const signInWithCustomPopup = async (type) => {
  const provider =
    type === "github"
      ? githubProvider
      : type === "facebook"
      ? facebookProvider
      : type === "google"
      ? googleProvider
      : "";

  try {
    await signInWithPopup(auth, provider);
    return { ok: true };
  } catch (error) {
    if (
      error.message.includes("(auth/account-exists-with-different-credential)")
    ) {
      return {
        ok: false,
        message:
          "This email is already registered with a different application.",
      };
    } else {
      return { ok: false, message: `Login failed, ${error.message}` };
    }
  }
};

export const db = getFirestore();
const storage = getStorage(app);

export const uploadPhoto = async (file, user) => {
  const storageRef = ref(storage, "profile-photos/" + `${user.uid}.jpg`);
  try {
    // Upload the file to Firebase Storage
    const response = await uploadBytes(storageRef, file);
    const photoUrlRef = ref(storage, `profile-photos/${user.uid}.jpg`);
    const photoUrl = await getDownloadURL(photoUrlRef);
    await editUserImage(user, photoUrl);
    return {
      ok: true,
      photoUrl: photoUrl,
      message: "Profile photo changed successfully.",
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error uploading profile photo." };
  }
};

const editUserImage = async (user, imageUrl) => {
  const userDocRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    userData.profile.photoURL = imageUrl;
    // Update the user's profile data
    await setDoc(userDocRef, {
      ...userData,
    });
  }
};

export const getUserProfileData = async (user) => {
  const uid = user.uid;
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data[0];
};

export const changeUserInfo = async (user) => {
  const userDocRef = doc(db, "users", user.uid);
  try {
    await setDoc(userDocRef, {
      ...user,
    });
    return { ok: true, message: "Profile uploaded successfully." };
  } catch (error) {
    return { ok: false, message: "Profile upload failed." };
  }
};

export const checkDuplicatedDisplayNames = async (displayName) => {
  try {
    const collectionRef = collection(db, "users");
    const usersQuery = query(
      collectionRef,
      where("displayName", "==", displayName)
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      return { data: [], ok: true }; // No users found with the given displayName.
    } else {
      return {ok: false, message: "User with this nickname already exists. Try to choose an unique nickname."}
    }
  } catch (error) {
    return { ok: false, message: "Internal server error." };
  }
};

export const getAllUsersDocuments = async () => {
  try {
    const collectionRef = collection(db, "users");
    const users = query(collectionRef);
    const usersSnapshot = await getDocs(users);
    const usersMap = usersSnapshot.docs.reduce((acc, docSnapshot) => {
      const { displayName, profile } = docSnapshot.data();
      acc.push({
        displayName: displayName,
        points: profile.points,
      });
      return acc;
    }, []);
    usersMap.sort((a, b) => b.points - a.points);
    return { data: usersMap, ok: true };
  } catch (err) {
    return { ok: false, message: "Users not loaded" };
  }
};

export const editUserProfile = async (user, category, points) => {
  const userDocRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    if (category === "good_answers") {
      userData.profile[category]++;
      userData.profile.points += points;
    } else if (category === "false_answers") {
      userData.profile[category]++;
      if (userData.profile.points - points <= 0) {
        userData.profile.points = 0;
      } else {
        userData.profile.points -= points;
      }
    } else {
      userData.profile[category]++;
    }

    // Update the user's profile data
    await setDoc(userDocRef, {
      ...userData,
    });
  }
};

const generateUniqueDisplayName = async (displayName) => {
  let duplicated = true;
  let suffix = 0;
  let uniqueDisplayName = displayName;
  while (duplicated) {
    const isDuplicatedDisplayName = await checkDuplicatedDisplayNames(uniqueDisplayName);
    if (isDuplicatedDisplayName.ok) {
      return uniqueDisplayName;
    } else {
      suffix++;
      uniqueDisplayName = `${uniqueDisplayName}${suffix}`;
    }
  }
}

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const photoURL = userAuth.photoURL ? userAuth.photoURL : null;
    const { email, displayName, uid } = userAuth;
    const uniqueDisplayName = await generateUniqueDisplayName(displayName);
    const profile = {
      points: 1000,
      good_answers: 0,
      false_answers: 0,
      quizzes_played: 0,
      quizzes_completed: 0,
      photoURL: photoURL,
    };
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        email,
        displayName: uniqueDisplayName,
        uid,
        profile: profile,
        createdAt,
        ...additionalInfo,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userDocRef;
};

export const createUserDocumentWithEmailAndPassword = async (
  email,
  password
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const emailPasswordSignIn = async ({ email, password }) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);
