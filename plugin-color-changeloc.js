//helper functions go here

// simple range
function range(start=0,end){
  return [...Array(end-start).keys()].map(i => i + start);
}

// random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// euclidean distance
function dist_between_points(x1,y1,x2,y2){
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

// Fisher-Yates shuffle

function shuffleArray(arr){
  let newArr = [];

  while (arr.length){
    let i = Math.floor(Math.random() * arr.length);
    newArr.push(arr.splice(i,1)[0]);
  }
  return newArr;
}



// code is based on Temilade Adekoya's plugin-ChangeLoc plugin
var jsPsychColorChangeLoc = (function (jspsych) {
  "use strict";
  
  const info = {
    name: "ColorChangeLocalizationPlugin",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {

      /** The duration of fixation prior to stimulus presentation */
      fixation_duration: {
        type: jspsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Fixation duration",
      },
      /** The number of TOTAL colors to show in the stimulus display*/
      n_colors: {
        type: jspsych.ParameterType.INT,
        default: 6,
        pretty_name: "Number of colors",
      },

      /** Colors which can appear (hex) */
      colors: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Colors",
        default: [
          "#c9281c",
          "#f0e10c",
          "#158009",
          "#062a9e",
          "#00FFFF",
          "#FF00FF",
          "#000000",
          "#FFFFFF",
        ],
      },
      /** The duration of the stimulus display */
      stim_duration: {
        type: jspsych.ParameterType.INT,
        default: 250,
        pretty_name: "Stimulus duration",
      },

      /** the duration of the delay period (ms) */

      delay_duration: {
        type: jspsych.ParameterType.INT,
        default: 4000,
        pretty_name: "Delay duration",
      }


    },
    data: {
      /** name of this trial */
      trial_exp: {
        type: jspsych.ParameterType.STRING,
      },

      /** Response key pressed */
      key: {
        type: jspsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt: {
        type: jspsych.ParameterType.INT,
      },

      /** Colors presented */
      stimuli: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Color positions */
      positions: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Index of the test */
      test_index: {
        type: jspsych.ParameterType.INT,
      },
      /** Test item */
      test_item: {
        type: jspsych.ParameterType.STRING,
      },
      /** Correct answer */
      correct_answer: {
        type: jspsych.ParameterType.STRING,
      },
      /** Array of responses */
      response_array: {
        type: jspsych.ParameterType.OBJECT,
        default: [],
      },
      /** Number of colors */
      n_colors: {
        type: jspsych.ParameterType.INT,
      },
      /** Accuracy */
      accuracy: {
        type: jspsych.ParameterType.BOOL,
      }
    }
  };

  
  /**
   * **{plugin-color-changeloc}**
   *
   * A plugin to run color change localization experiments of varying set sizes
   * Display stimuli simultaneously, then test on a array of the same with one changed
   *
   * @author Darius Suplica
   * @see {@link {https://github.com/dsuplica/change-localization-jspsych-plugins}}
   */
  class ColorChangeLocPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }


    trial(display_element, trial) {
      let test_index; // index of item to be changed
      let test_item; // new value for changed item
      let response_array = range(1, trial.n_colors + 1); // array of possible responses
      const valid_responses = response_array.map(String); // array of valid responses
      const canvasSize = 600;
      const edge_buffer = 50;
      const stim_buffer = 10; 
      const stim_size = 40;


      // MAIN EXPERIMENT CODE


      //CREATE CANVAS OBJECT//
      display_element.innerHTML =
      "<div id='jspsych-changeloc-plugin' style='position: relative; width:" +
      canvasSize +
      "px; height:" +
      canvasSize +
      "px'></div>";
      display_element.querySelector("#jspsych-changeloc-plugin").innerHTML +=
        "<canvas id='c', width = '" +
        canvasSize +
        "', height = '" +
        canvasSize +
        "'/canvas>";

      //CREATE FABRIC OBJECT//
      let canvas = new fabric.Canvas("c");
      canvas.set({
        renderOnAddRemove: false,
        selection: false,
        backgroundColor: "#9E9E9E",
      });

      function show_fixation() {
        //SHOW FIXATION CROSS//
        let fixation = new fabric.Text("+", {
          id: "fixation",
          fill: "#FFFFFF",
          fontSize: 30,
          hasBorders: false,
          hasControls: false,
          hoverCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
        });
        canvas.add(fixation);
        fixation.center();
        canvas.requestRenderAll();
      }


      // GET POSITION ARRAYS


      let position_array = [];

      const stim_diag = Math.sqrt(2) * stim_size; // diagonal distance

      while (position_array.length < trial.n_colors) {
        let x = randomInt(edge_buffer, canvasSize - edge_buffer);
        let y = randomInt(edge_buffer, canvasSize - edge_buffer);
    
        if (dist_between_points(x, y, 0, 0) < stim_size + stim_buffer) {
            continue; // too close to center
        }
        
        for ([x2,y2] of position_array) {
            if (dist_between_points(x, y, x2, y2) < stim_diag + stim_buffer) {
                continue; // too close to another stimulus
            }
        }

        // Add the position to the array if it passes the check
        position_array.push([x, y]);
    }


    // CREATE STIMULI

    let stimulus_array = [];
    let colors_shuff = shuffleArray(trial.colors);
    for (let i = 0; i < trial.n_colors; i++) { // append stimuli (should be already shuffled)
      stimulus_array.push({stimulus: colors_shuff[i], type: "color"});
    }


    

    // drawing functions, basically straight copy paste
    const draw_stim = (stimulus, pos, label) => {
      var pattern = /^#/;
      var is_color = pattern.test(stimulus); //SEARCH FOR '#' IN STIMULUS ARGUMENT TO CONFIRM STIMULUS IS A COLOR//
      return new Promise(async (resolve, reject) => {
        if (is_color) {
          var rect = new fabric.Rect({
            width: stim_size,
            height: stim_size,
            left: pos[0] - stim_size / 2, // shift to convert from center to left and top
            top: pos[1] + stim_size / 2,
            fill: stimulus,
            hasBorders: false,
            hasControls: false,
            hoverCursor: "default",
            lockMovementX: true,
            lockMovementY: true,
          });
          canvas.add(rect);
          canvas.requestRenderAll();
          resolve();
          if (label) {
            //ADD NUMBER LABEL//
            var label_object = new fabric.Text(label.toString(), {
              left: pos[0] - stim_size / 2, // shift to convert from center to left and top
              top: pos[1] + stim_size / 2,
              fill: "#9897A9",
              fontSize: 30,
              fontWeight: "bold",
              hasBorders: false,
              hasControls: false,
              hoverCursor: "default",
              lockMovementX: true,
              lockMovementY: true,
            });
            canvas.add(label_object);
            canvas.requestRenderAll();
            resolve();
          }
        }
      });
    };

    const present_test = async () => {
      //CREATE ARRAY OF DESIRED RESPONSES & SHUFFLE//
      let response_array = shuffleArray(response_array);
      // get index of test item
      test_index = randomInt(0,stimulus_array.length);

      for (var i = 0; i < stimulus_array.length; i++) {
        // replace test stim with a new one
        if (i === test_index) {
          test_item = colors_shuff[7];
          draw_stim(test_item, position_array[i], response_array[i]);
        } else {
          draw_stim(
            stimulus_array[i].stimulus,
            position_array[i],
            response_array[i]
          );
        }
        canvas.requestRenderAll();
      }

      // event listener
      // idk what this does tbh
      var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterResponse,
        valid_responses: valid_responses,
        rt_method: "performance",
        persist: false,
        allow_held_key: false,
      });
    };


    // MAIN TRIAL PROCEDURE HERE

    const trial_procedure = async () => {

      
      // present initial stimulus array
      for (let istim = 0; istim < stimulus_array.length; istim++) {
        await draw_stim(stimulus_array[istim].stimulus, position_array[istim]);
      }

      // present delay period and then test
      // i should be an honorary italian
      // this is straight spaghetti i hate it
      this.jsPsych.pluginAPI.setTimeout(function () {
        // function to remove objects, executed at end of stim period
        canvas.getObjects().forEach((o) => {
          if (!o.id) {
            canvas.remove(o);
          }
        });
        canvas.requestRenderAll();
          this.jsPsych.pluginAPI.setTimeout(function () {
            test_procedure();
          }, trial.delay_duration); // delay period, executed at end
        }, trial.stim_duration);
      };

      // actually run the trial here
      show_fixation();
      this.jsPsych.pluginAPI.setTimeout(trial_procedure, trial.fixation_duration);

      function afterResponse(info){
        end_trial(info.key,info.rt)
      }
      const end_trial = (key,rt) => {

        // data saving
        var trial_data = {
          trial_exp: "color_change_localization",
          key: key,
          rt: rt,
          stimuli: stimulus_array,
          positions: position_array,
          test_index: test_index,
          test_item: test_item,
          correct_answer: response_array[test_index],
          response_array: response_array,
          n_colors: trial.n_colors,
          accuracy: key == response_array[test_index],
          

        };
        console.log(trial_data)
        // end trial and go to next
        this.jsPsych.finishTrial(trial_data);
      }
    }
  }
  ColorChangeLocPlugin.info = info;

  return ColorChangeLocPlugin;
})(jsPsychModule);