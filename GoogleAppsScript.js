/** 
 * Google Apps Script for Ceylon Petroleum Corporation LMS
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Form.
 * 2. Click the 3 dots in the top right corner and select "Script Editor".
 * 3. Delete any existing code and paste this entire file.
 * 4. Replace the URL in `UrlFetchApp.fetch` with your actual Ngrok or Server URL.
 * 5. Click the "Triggers" clock icon on the left menu -> Add Trigger.
 * 6. Set "Choose which function to run" to "onFormSubmit".
 * 7. Set "Select event type" to "On form submit".
 * 8. Save and allow Google account permissions.
 */

function onFormSubmit(e) {
  try {
    var formResponse = e.response;
    var itemResponses = formResponse.getItemResponses();
    var payload = {};
    
    // Default fallback structures
    payload.olResults = {};
    payload.alResults = {};
    var ref1 = {}, ref2 = {};
    var wExp = {};
    var refCounter = 0;
    
    for (var i = 0; i < itemResponses.length; i++) {
      var itemResponse = itemResponses[i];
      var title = itemResponse.getItem().getTitle().trim();
      var answer = itemResponse.getResponse();
      
      if(title === "Full Name of the Applicant") payload.fullName = answer;
      else if(title === "Name with initials") payload.nameWithInitials = answer;
      else if(title === "Permanent Address") payload.address = answer;
      else if(title === "District") payload.district = answer;
      else if(title === "Contact Number (Mobile)") payload.mobile = answer;
      else if(title === "Contact Number (Landline)") payload.landline = answer;
      else if(title === "Date of Birth") payload.dob = answer;
      else if(title === "Gender") payload.gender = answer;
      else if(title === "Civil Status") payload.civilStatus = answer;
      else if(title === "NIC Number") payload.nic = answer;
      else if(title.indexOf("G.C.E Ordinary Level (O/L) - Year") !== -1) payload.olYear = answer;
      else if(title === "Sinhala/Tamil Language") payload.olResults.sinhala = answer;
      else if(title === "English") payload.olResults.english = answer;
      else if(title === "Mathematics") payload.olResults.maths = answer;
      else if(title === "Science") payload.olResults.science = answer;
      else if(title.indexOf("G.C.E Advanced Level (A/L) - Year") !== -1) payload.alYear = answer;
      else if(title === "Stream") payload.alStream = answer;
      else if(title === "Subject 01") payload.alResults.sub1 = answer;
      else if(title === "Subject 02") payload.alResults.sub2 = answer;
      else if(title === "Subject 03") payload.alResults.sub3 = answer;
      else if(title.indexOf("preference of the training program") !== -1) payload.trainingPreference = answer;
      else if(title === "Company") wExp.company = answer;
      else if(title === "Designation") wExp.designation = answer;
      else if(title === "From") wExp.from = answer;
      else if(title === "To") wExp.to = answer;
      else if(title === "Special Achievement") payload.specialAchievements = answer;
      else if(title === "Sports Achievements") payload.sportsAchievements = answer;
      else if(title === "Name & Designation") {
         if(refCounter === 0) ref1.name = answer;
         else ref2.name = answer;
      }
      else if(title === "Contact Number") {
         if(refCounter === 0) ref1.contact = answer;
         else ref2.contact = answer;
      }
      else if(title === "E-mail") {
         if(refCounter === 0) { ref1.email = answer; refCounter++; } // increment on last field of referee 1
         else ref2.email = answer;
      }
      else if(title.indexOf("Upload your detailed CV") !== -1) {
        // the form gives the file ID if it's a file upload
        payload.cvDriveLink = Array.isArray(answer) ? answer.join(",") : answer; 
      }
    }
    
    // Package objects into arrays as expected by API
    payload.workExperience = Object.keys(wExp).length > 0 ? [wExp] : [];
    
    var refs = [];
    if(Object.keys(ref1).length > 0) refs.push(ref1);
    if(Object.keys(ref2).length > 0) refs.push(ref2);
    payload.referees = refs;
    
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };
    
    // TODO: REPLACE THIS URL WITH YOUR NGROK URL
    // e.g. "https://1234-abcd.ngrok-free.app/api/applications/webhook"
    UrlFetchApp.fetch("https://green-cats-shave.loca.lt/api/applications/webhook", options);
    
  } catch(err) {
    Logger.log("Webhook Error: " + err.toString());
  }
}
