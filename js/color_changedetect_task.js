var jsPsych = initJsPsych();



// // Uncomment these to actually run the experiment


// /////////////////////////////////
// //// PAVLOVIA THINGS GO HERE ////
// /////////////////////////////////

// //TIMELINE VARIABLES//
// //SAVE INFO TO PAVLOVIA//
// var pavloviaInfo;
// /* init connection with pavlovia.org */
// var pavlovia_init = {
//   type: jsPsychPavlovia,
//   command: "init",
//   // Store info received by Pavlovia init into the global variable `pavloviaInfo`
//   setPavloviaInfo: function (info) {
//     console.log(info);
//     pavloviaInfo = info;
//   },
// };


// /* finish connection with pavlovia.org */
// var pavlovia_finish = {
//   type: jsPsychPavlovia,
//   command: "finish",
//   // Thomas Pronk; call this function when we're done with the experiment and data reception has been confirmed by Pavlovia
//   completedCallback: function () {
//     alert("data successfully submitted!");
//   },
// };

// //////////////////////////////////
// /////// DEMOGRAPHIC TRIALS ///////
// //////////////////////////////////

// var welcome = {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: "Welcome to the experiment. Press any key to continue.",
//   };
  
//   var form_trial = {
//     type: jsPsychSurveyText,
//     questions: [{ prompt: "What is your <b>unique ID</b>?:", required: true }],
//   };
  
//   var age_trial = {
//     type: jsPsychSurveyText,
//     questions: [
//       {
//         prompt:
//           "Please provide the following demographic information" +
//           " for reporting purposes: Your Age:",
//         required: true,
//       },
//     ],
//   };
//   var gender_options = ["Male", "Female", "Other", "Choose not to respond"];
//   var ethnicity_options = [
//     "Yes, Hispanic or Latino",
//     "No, not Hispanic or Latino",
//     "Choose not to respond",
//   ];
//   var race_options = [
//     "American Indian or Alaskan Native",
//     "Asian",
//     "Pacific Islander",
//     "Black or African American",
//     "White/Caucasian",
//     "More than one race/ethnicity",
//     "Choose not to respond",
//   ];
//   var multi_choice_block = {
//     type: jsPsychSurveyMultiSelect,
//     questions: [
//       {
//         prompt: "Gender:",
//         name: "Gender",
//         options: gender_options,
//         required: true,
//       },
//       {
//         prompt: "Are you of Hispanic or Latino regions of descent?",
//         name: "Ethnicity",
//         options: ethnicity_options,
//         required: true,
//       },
//       {
//         prompt: "Which race/ehtnicity best describes you?",
//         name: "Race",
//         options: race_options,
//         required: true,
//       },
//     ],
//   };


var changedetect_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["Y"],
  stimulus:
    "CHANGE DETECTION TASK: You will be presented with a series of images." +
    "After a short delay, you will be presented with a single other image" +
    "If it has changed, press z; otherwise press slash. Press Y to continue.",

};



  

var trial = {
  type: jsPsychChangeDetection,
      fixation_duration: 500,
      set_size: 6,
      stimuli: colors,
      stim_duration: 200,
      delay_duration: 1300,
      keys: ["z", "/"],
};


var colors = [
  "#c9281c",
  "#f0e10c",
  "#158009",
  "#062a9e",
  "#00FFFF",
  "#FF00FF",
  "#000000",
  "#FFFFFF",
]




var test_procedure = {
  timeline: [trial],
  repetitions: 60,
};  


var end_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
      "This is the end of the experiment. Thank you for participating!",
    choices: "NO_KEYS",
  };

  // var preload = {
  //   type: jsPsychPreload,
  //   images: images,
  // };


var timeline = [];
// timeline.push(preload)

// timeline.push(pavlovia_init);
// timeline.push(preload);

// timeline.push(form_trial);
// timeline.push(age_trial);
// timeline.push(multi_choice_block);

timeline.push(changedetect_instructions);
timeline.push(test_procedure); // change localization
timeline.push(end_trial);

jsPsych.run(timeline);
