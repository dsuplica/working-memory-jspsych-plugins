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


var changeloc_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p> In this first part of the experiment, a central fixation "+" will appear onto the screen 
        for 500 milliseconds (0.5 second), followed by an array of <strong>four</strong>
        orientations appearing for 250 milliseconds (0.25 second).</p><p>
        Then, another array of <strong>four</strong> colored squares with numbers (1,2,3,4)
        above them will appear after a 4-second blank screen.</p><p> Press the 
        corresponding button on your <strong>KEYBOARD</strong> to indicate which of the
        images has changed. Only one of the objects will change .</p><p>The experiment
         contains 60 trials in total.</p><p> Press any key to begin. </p>
        `,
  };
  

var trial = {
    type: jsPsychImageChangeLoc,
        fixation_duration: jsPsych.timelineVariable("fixation_duration"),
        n_stimuli: jsPsych.timelineVariable("n_stimuli"),
        images: jsPsych.timelineVariable("images"),
        stim_duration: jsPsych.timelineVariable("stim_duration"),
        delay_duration: jsPsych.timelineVariable("delay_duration"),


};

var images = [
  "stim/0.png",
  "stim/45.png",
  "stim/90.png",
  "stim/135.png",
  "stim/180.png",
  "stim/225.png",
  "stim/270.png",
  "stim/315.png",
];

var test_procedure = {
    timeline: [trial],
    timeline_variables: [{fixation_duration: 1000,
                        n_stimuli: 4,
                        images: images,
                        stim_duration: 250,
                        delay_duration: 4000}],
    repetitions: 60,
};  

var end_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
      "This is the end of the experiment. Thank you for participating! <a href='https://app.prolific.co/submissions/complete?cc=61E9BFCF'>Click here</a> to return to Prolific.",
    choices: "NO_KEYS",
  };


var timeline = [];

// timeline.push(pavlovia_init);
// timeline.push(preload);

// timeline.push(form_trial);
// timeline.push(age_trial);
// timeline.push(multi_choice_block);

timeline.push(changeloc_instructions);
timeline.push(test_procedure); // change localization
timeline.push(end_trial);

jsPsych.run(timeline);
