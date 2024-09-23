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
  choices: ["Y"],
  stimulus:
    "<p>This is the last part of our study. You'll first be shown six colored sqaures and then four abstract orientations on the screen for 0.25 second. " +
    "Your task is to remember as many <b> colors and orientations</b> as possible. </p>" +
    "<p>Shortly after, four more orientations are going to be shown at the same locations the original four were shown." +
    " <b>Only one of them changed its orientation during this brief delay. " +
    "Your task is to indicate which one changed its shape by pressing the number 1-4) on top of it. </b></p>" +
    "<p>After this test, six colored squares are going to be shown at the same locations the original six were shown." +
    " <b>Only one of them changed its orientation during this brief delay. " +
    "Your task is to indicate which one changed its color by pressing the number (1-6) on top of it. </b></p>" +
    "<p>Press Y button if you understand the instruction and would like to start the actual test now." +
    "<b> The test will have 60 trials in total and will start right after you press Y so get ready before hitting the button. </b></p> ",
};



  

var trial = {
    type: jsPsychChangeLocDual,
        fixation_duration: jsPsych.timelineVariable("fixation_duration"),
        set_size_1: jsPsych.timelineVariable("set_size_1"),
        stimuli_1: jsPsych.timelineVariable("stimuli_1"),
        stim_duration_1: jsPsych.timelineVariable("stim_duration_1"),
        isi: jsPsych.timelineVariable("isi"),
        set_size_2: jsPsych.timelineVariable("set_size_2"),
        stimuli_2: jsPsych.timelineVariable("stimuli_2"),
        stim_duration_2: jsPsych.timelineVariable("stim_duration_2"),
        delay_duration: jsPsych.timelineVariable("delay_duration"),
        probe_order: jsPsych.timelineVariable("probe_order"),
        probe_delay: jsPsych.timelineVariable("probe_delay"),

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

var images = [
  "./stim/0.png",
  "./stim/45.png",
  "./stim/90.png",
  "./stim/135.png",
  "./stim/180.png",
  "./stim/225.png",
  "./stim/270.png",
  "./stim/315.png",
];



var test_procedure = {
    timeline: [trial],
    timeline_variables: [{fixation_duration: 1000,
                        set_size_1: 6,
                        stimuli_1: colors,
                        stim_duration_1: 250,
                        isi: 1000,
                        set_size_2: 4,
                        stimuli_2: images,
                        stim_duration_2: 250,
                        delay_duration: 4000,
                        probe_order: [0,1],
                        probe_delay: 500}],
    repetitions: 5,
};  

var end_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
      "This is the end of the experiment. Thank you for participating! <a href='https://app.prolific.co/submissions/complete?cc=61E9BFCF'>Click here</a> to return to Prolific.",
    choices: "NO_KEYS",
  };

  var preload = {
    type: jsPsychPreload,
    images: images,
  };


var timeline = [];
timeline.push(preload)

// timeline.push(pavlovia_init);
// timeline.push(preload);

// timeline.push(form_trial);
// timeline.push(age_trial);
// timeline.push(multi_choice_block);

timeline.push(changeloc_instructions);
timeline.push(test_procedure); // change localization
timeline.push(end_trial);

jsPsych.run(timeline);
