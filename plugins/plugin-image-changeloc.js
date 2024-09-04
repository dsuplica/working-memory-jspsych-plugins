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
	ixs = [...Array(arr.length).keys()]
  let newArr = [];
  while (ixs.length){
    let i = Math.floor(Math.random() * ixs.length);
    newArr.push(arr[ixs.splice(i,1)]);
  }
  return newArr;
}




// code is based on Temilade Adekoya's plugin-ChangeLoc plugin
var jsPsychImageChangeLoc = (function (jspsych) {
  "use strict";
  
  const info = {
    name: "ImageChangeLocalizationPlugin",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {

      /** The duration of fixation prior to stimulus presentation */
      fixation_duration: {
        type: jspsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Fixation duration",
      },
      /** The number of TOTAL images to show in the stimulus display*/
      n_images: {
        type: jspsych.ParameterType.INT,
        default: 6,
        pretty_name: "Number of Images",
      },

      /**Paths to the images which can appear in this trial */
      images: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Images",
        default: [
          "stim/0.png",
          "stim/45.png",
          "stim/90.png",
          "stim/135.png",
          "stim/180.png",
          "stim/225.png",
          "stim/270.png",
          "stim/315.png",
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

      /** Images presented */
      stimuli: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Image positions */
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
      /** Number of images */
      set_size: {
        type: jspsych.ParameterType.INT,
      },
      /** Accuracy */
      accuracy: {
        type: jspsych.ParameterType.BOOL,
      }
    }
  };

  
  /**
   * **{plugin-image-changeloc}**
   *
   * A plugin to run image change localization experiments of varying set sizes
   * Useful for orientation or shape trials
   * Display stimuli simultaneously, then test on a array of the same with one changed
   *
   * @author Darius Suplica
   * @see {@link {https://github.com/dsuplica/change-localization-jspsych-plugins}}
   */
  class ImageChangeLocPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }


    trial(display_element, trial) {

      let test_index; // index of item to be changed
      let test_item; // new value for changed item
      let response_array = range(1, trial.set_size + 1); // array of possible responses
      const valid_responses = response_array.map(String); // array of valid responses
      const canvasSize = 600;
      const edge_buffer = 100;
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

      position_loop:
      while (position_array.length < trial.set_size) {
        let x = randomInt(edge_buffer, canvasSize - edge_buffer);
        let y = randomInt(edge_buffer, canvasSize - edge_buffer);
        let x2;
        let y2;
    
        if (dist_between_points(x, y, 0, 0) < stim_diag * 3 + stim_buffer) {
            continue position_loop; // too close to center
        }
        
        if (position_array.length > 0) {
          for ([x2,y2] of position_array) {
              if (dist_between_points(x, y, x2, y2) < stim_diag * 2 + stim_buffer) {
                  continue position_loop; // too close to another stimulus
              }
            }
        }
        

        // Add the position to the array if it passes the check
        position_array.push([x, y]);
    }

    // CREATE STIMULI

    let stimulus_array = [];
    let images_shuff = shuffleArray(trial.images);
    for (let i = 0; i < trial.set_size; i++) { // append stimuli (should be already shuffled)
      stimulus_array.push({stimulus: images_shuff[i], type: "image"});
    }


    

    // drawing functions, basically straight copy paste
    const draw_stim = (stimulus, pos, label) => {
      return new Promise(async (resolve, reject) => {
        var img = new fabric.Image.fromURL({
          width: stim_size,
          height: stim_size,
          left: pos[0] - stim_size / 2, // shift to convert from center to left and top
          top: pos[1] - stim_size / 2,
          fill: stimulus,
          hasBorders: false,
          hasControls: false,
          hoverCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
        });
        canvas.add(img);
        canvas.requestRenderAll();
        resolve();
        if (label) {
          //ADD NUMBER LABEL//
          var label_object = new fabric.Text(label.toString(), {
            left: pos[0] - stim_size / 4, // shift to convert from center to left and top
            top: pos[1] - stim_size / 2,
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

      });
    };

    const present_test = async () => {
      //CREATE ARRAY OF DESIRED RESPONSES & SHUFFLE//
      response_array = shuffleArray(response_array);
      // get index of test item
      test_index = randomInt(0,stimulus_array.length);

      for (var i = 0; i < stimulus_array.length; i++) {
        // replace test stim with a new one
        if (i === test_index) {
          test_item = images_shuff[trial.set_size + 1];
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
            present_test();
          }, trial.delay_duration); // delay period, executed at end
        }, trial.stim_duration);
      };

      // actually run the trial here
      show_fixation();

      this.jsPsych.pluginAPI.setTimeout(function () {
        //INTERTRIAL INTERVAL//
        trial_procedure();
      }, trial.fixation_duration);
      
      function afterResponse(info){
        end_trial(info.key,info.rt)
      }
      const end_trial = (key,rt) => {

        // remove event listeners
        $(document).unbind();
        // data saving
        // let accuracy = jsPsych.pluginAPI.compareKeys(key, String(response_array[test_index]));
        let accuracy = key === String(response_array[test_index]);
        var trial_data = {
          trial_exp: "image_change_localization",
          key: key,
          rt: rt,
          stimuli: stimulus_array,
          positions: position_array,
          test_index: test_index,
          test_item: test_item,
          correct_answer: response_array[test_index],
          response_array: response_array,
          set_size: trial.set_size,
          accuracy: accuracy,
          

        };
        console.log(trial_data)
        // end trial and go to next
        this.jsPsych.finishTrial(trial_data);
      }
    }
  }
  ImageChangeLocPlugin.info = info;

  return ImageChangeLocPlugin;
})(jsPsychModule);