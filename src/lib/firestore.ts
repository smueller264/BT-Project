import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export async function saveCourseData(courseType: string, userPerformance: number, questionnaireAnswers: Record<string, string | number>) {
  try {
    console.log('Attempting to save course data:', { courseType, userPerformance, questionnaireAnswers });
    const docRef = await addDoc(collection(db, 'courseData'), {
      courseType,
      userPerformance,
      questionnaireAnswers,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    if (e instanceof Error) {
      console.error("Error name:", e.name);
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
    }
    throw e;
  }
}

export async function testFirebaseConnection(connected: boolean) {
    try {
      const testDocRef = doc(db, "test", "connection");
      const testDoc = await getDoc(testDocRef);
      
      if (testDoc.exists()) {
        console.log('Successfully connected to Firebase. Test document data:', testDoc.data());
        return true;
      } else {
        console.log('Firebase connection successful, but test document does not exist.');
        return false;
      }
    } catch (error) {
      console.error('Error testing Firebase connection:', error);
      return false;
    }

}