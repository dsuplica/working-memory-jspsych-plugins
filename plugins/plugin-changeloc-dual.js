//helper functions go here

// simple range
function range(start = 0, end) {
  return [...Array(end - start).keys()].map(i => i + start);
}

// random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// euclidean distance
function dist_between_points(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Fisher-Yates shuffle

function shuffleArray(arr) {
  ixs = [...Array(arr.length).keys()]
  let newArr = [];
  while (ixs.length) {
    let i = Math.floor(Math.random() * ixs.length);
    newArr.push(arr[ixs.splice(i, 1)]);
  }
  return newArr;
}

function randChoice(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}




// code is based on Temilade Adekoya's plugin-ChangeLoc plugin
var jsPsychChangeLocDual = (function (jsPsych) {
  "use strict";

  const info = {
    name: "ChangeLocalizationPlugin",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {

      /** The duration of INITIAL fixation prior to stimulus presentation */
      fixation_duration: {
        type: jsPsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Fixation duration",
      },


      /** Set size for first stimulus set*/
      set_size_1: {
        type: jsPsych.ParameterType.INT,
        default: 6,
        pretty_name: "Number of stimuli",
      },

      /** First stimulus set */
      stimuli_1: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Stimuli",
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


      /** Stimuli to present in set 1 (overrides random selection) */
      stim_manual_1: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set stimuli",
        default: [],
      },

      /** Locations to present stimuli at for set 1 (overrides random selection) */

      pos_manual_1: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set positions",
        default: [],
      },

      /** The duration of the first stimulus display */
      stim_duration_1: {
        type: jsPsych.ParameterType.INT,
        default: 250,
        pretty_name: "Stimulus duration",
      },

      /** delay between presenting the first and second stimuli */
      isi: {
        type: jsPsych.ParameterType.INT,
        default: 500,
        pretty_name: "Interstimulus interval",
      },



      /** Set size for second stimulus set*/
      set_size_2: {
        type: jsPsych.ParameterType.INT,
        default: 4,
        pretty_name: "Number of stimuli",
      },

      /** Second stimulus set */
      stimuli_2: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Stimuli",
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


      /** Stimuli to present in set 2 (overrides random selection) */
      stim_manual_2: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set stimuli",
        default: [],
      },

      /** Locations to present stimuli at for set 2 (overrides random selection) */

      pos_manual_2: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set positions",
        default: [],
      },

      /** The duration of the second stimulus display */
      stim_duration_2: {
        type: jsPsych.ParameterType.INT,
        default: 250,
        pretty_name: "Stimulus duration",
      },


      /** the duration of the delay period (ms) */

      delay_duration: {
        type: jsPsych.ParameterType.INT,
        default: 4000,
        pretty_name: "Delay duration",
      },

      /** the order in which to probe each set */
      probe_order: {
        type: jsPsych.ParameterType.OBJECT,
        default: [0,1],
        pretty_name: "Probe order",
      },
      /** The delay between probes */

      probe_delay: {
        type: jsPsych.ParameterType.INT,
        default: 500,
        pretty_name: "Probe delay",
      },

      /** name of each trial */
      trial_exp: {
        type: jsPsych.ParameterType.STRING,
        default: "change_localization_dual",
      },

      /** graphic parameters */
      graphics: {
        type: jsPsych.ParameterType.OBJECT,
        default: {
          canvasSize: 600,
          edge_buffer: 100,
          stim_buffer: 50,
          stim_size: 40,
        },
      }      


    },
    data: {
      /** name of this trial */
      trial_exp: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Order of test */
      probe_order: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Response key pressed */
      key_1: {
        type: jsPsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt_1: {
        type: jsPsych.ParameterType.INT,
      },

      /** Stims presented */
      stimuli_1: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Stim positions */
      positions_1: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Index of the test */
      test_index_1: {
        type: jsPsych.ParameterType.INT,
      },
      /** Test item */
      test_item_1: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Correct answer */
      correct_answer_1: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Array of responses */

      response_array_1: {
        type: jsPsych.ParameterType.OBJECT,
        default: [],
      },
      /** Number of stimuli */
      set_size_1: {
        type: jsPsych.ParameterType.INT,
      },
      /** Accuracy */
      accuracy_1: {
        type: jsPsych.ParameterType.BOOL,
      },
      
      /** Response key pressed */
      key_2: {
        type: jsPsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt_2: {
        type: jsPsych.ParameterType.INT,
      },

      /** Stims presented */
      stimuli_2: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Stim positions */
      positions_2: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Index of the test */
      test_index_2: {
        type: jsPsych.ParameterType.INT,
      },
      /** Test item */
      test_item_2: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Correct answer */
      correct_answer_2: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Array of responses */
      response_array_2: {
        type: jsPsych.ParameterType.OBJECT,
        default: [],
      },
      /** Number of stimuli */
      set_size_2: {
        type: jsPsych.ParameterType.INT,
      },
      /** Accuracy for stimulus */
      accuracy_2: {
        type: jsPsych.ParameterType.BOOL,
      },
      
    }
  };


  /**
   * **{plugin-changeloc-single}**
   *
   * A plugin to run change localization experiments of varying set sizes
   * Display stimuli simultaneously, then test on a array of the same with one changed
   * Can run with colors or images
   *
   * @author Darius Suplica
   * @see {@link {https://github.com/dsuplica/change-localization-jsPsych-plugins}}
   */
  class DualChangeLocPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }


    trial(display_element, trial) {

      // CHECKS IF OVERRIDES ARE SET and set set_size appropriately if so

      if (trial.stim_manual_1.length > 0 && trial.pos_manual_1.length > 0 && trial.stim_manual_1.length !== trial.pos_manual_1.length) {
        throw new Error("Stimulus array length does not match set size");
      } else if (trial.stim_manual_1.length > 0) {
        trial.set_size_1 = trial.stim_manual_1.length;
      } else if (trial.pos_manual_1.length > 0) {
        trial.set_size_1 = trial.pos_manual_1.length;
      }

      if (trial.stim_manual_2.length > 0 && trial.pos_manual_2.length > 0 && trial.stim_manual_2.length !== trial.pos_manual_2.length) {
        throw new Error("Stimulus array length does not match set size");
      } else if (trial.stim_manual_2.length > 0) {
        trial.set_size_2 = trial.stim_manual_2.length;
      } else if (trial.pos_manual_2.length > 0) {
        trial.set_size_2 = trial.pos_manual_2.length;
      }

      // VARIABLE HARDCODING. TODO: make these trial parameters

      let response_array_1 = range(1, trial.set_size_1 + 1); // array of possible responses


      let response_array_2 = range(1, trial.set_size_2 + 1); 

      const canvasSize = trial.graphics.canvasSize;
      const edge_buffer = trial.graphics.edge_buffer;
      const stim_buffer = trial.graphics.stim_buffer;
      const stim_size = trial.graphics.stim_size;


      // MAIN EXPERIMENT CODE


      //CREATE CANVAS OBJECT//
      display_element.innerHTML =
        "<div id='jsPsych-changeloc-plugin' style='position: relative; width:" +
        canvasSize +
        "px; height:" +
        canvasSize +
        "px'></div>";
      display_element.querySelector("#jsPsych-changeloc-plugin").innerHTML +=
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

      // function to assign positions

      const assign_positions = (set_size,manual,max_repeats = 1000) => {
        return new Promise((resolve, reject) => {

          let position_array = [];

          if (manual.length > 0) {
            for (let i = 0; i < set_size; i++) {
              position_array.push(manual[i])
            }
            
            resolve(position_array);
          }

          const stim_diag = Math.sqrt(2) * stim_size / 2; // diagonal distance
          let i = 0;
          let loop_counter = 0;

          position_loop:
          while (position_array.length < set_size) {
            i++;
            // avoid infinite while loop
            if (i>max_repeats){
              if (loop_counter > 1000) {
                // this exists so we don't get stuck in an infinite loop. This is bad if it runs
                alert('POSITION ASSIGNMENT ERROR: Please contact your experimenter.')
                throw new Error("Could not find valid positions")
              }

              position_array = [];
              i = 0;
              loop_counter++;
              continue position_loop; // restart loop
            }

            let x = randomInt(edge_buffer, canvasSize - edge_buffer);
            let y = randomInt(edge_buffer, canvasSize - edge_buffer);
            let x2;
            let y2;

            if (dist_between_points(x, y, canvasSize/2, canvasSize/2) < stim_diag + stim_buffer) {
              continue position_loop; // too close to center
            }

            if (position_array.length > 0) {
              for ([x2, y2] of position_array) {
                if (dist_between_points(x, y, x2, y2) < stim_diag * 2 + stim_buffer) {
                  continue position_loop; // too close to another stimulus
                }
              }
            }
            // Add the position to the array if it passes the check
            position_array.push([x, y]);
          }
          resolve(position_array);
        });
      }

      // drawing functions, basically straight copy paste


      const draw_colored_square = (color, pos, label) => {

        return new Promise(async (resolve, reject) => {
          var rect = new fabric.Rect({
            width: stim_size,
            height: stim_size,
            left: pos[0] - stim_size / 2, // shift to convert from center to left and top
            top: pos[1] - stim_size / 2,
            fill: color,
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
              left: pos[0] - stim_size / 4, // shift to convert from center to left and top
              top: pos[1] - stim_size / 2,
              fill: "#9E9E9E",
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

      const draw_image = (image, pos, label) => {
        return new Promise((resolve, reject) => {
          fabric.Image.fromURL(image, function (img) {
            img.set({
              left: pos[0] - stim_size / 2, // shift to convert from center to left and top
              top: pos[1] - stim_size / 2,
              hasBorders: false,
              hasControls: false,
              hoverCursor: "default",
              lockMovementX: true,
              lockMovementY: true,
            });
            img.scaleToWidth(stim_size);
            img.scaleToHeight(stim_size);
            canvas.add(img);
            canvas.requestRenderAll();

            if (label) {

              // ADD NUMBER LABEL
              var label_object = new fabric.Text(label.toString(), {
                left: pos[0] - stim_size / 4, // shift to convert from center to left and top
                top: pos[1] - stim_size / 2,
                fill: "#FFFFFF",
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
            }

            resolve();
          });
        });
      };

      const draw_stim = async (stimulus, pos, label) => {
        let pattern = /^#/;
        let is_color = pattern.test(stimulus); // SEARCH FOR '#' IN STIMULUS ARGUMENT TO CONFIRM STIMULUS IS A COLOR
        if (is_color) {
          await draw_colored_square(stimulus, pos, label);
        } else {
          await draw_image(stimulus, pos, label);
        }
      };

      const clear_screen = () => { // remove all stimuli on screen
        canvas.getObjects().forEach((o) => {
          if (!o.id) {
            canvas.remove(o);
          }
        });
        canvas.requestRenderAll();

      }


      // function to assign, present, and return test
      const present_test = async (stimulus_array,position_array,response_array,all_stimuli,delay) => {
        //CREATE ARRAY OF DESIRED RESPONSES & SHUFFLE
        response_array = shuffleArray(response_array);
        // get index of test item
        let test_index = randomInt(0, stimulus_array.length);
        let test_item = randChoice(all_stimuli.filter(x => !stimulus_array.includes(x))); // get a unique value from stimuli
        let new_stim_array = stimulus_array.slice(); // copy array

        new_stim_array[test_index] = test_item;

        // show the initial array after waiting the delay before
        this.jsPsych.pluginAPI.setTimeout(async function () {
          for (let istim = 0; istim < new_stim_array.length; istim++) { // show stimuli with response
            await draw_stim(new_stim_array[istim], position_array[istim]);
          }
          this.jsPsych.pluginAPI.setTimeout(async function () { // then draw with numbers after 100ms
            for (let istim = 0; istim < new_stim_array.length; istim++) {
              await draw_stim(new_stim_array[istim], position_array[istim], response_array[istim]);
            }
          },100);
        },delay);
        return [response_array,test_index,test_item];
      }


      // function to handle stimulus presentation and fixations before and after
      const present_stimuli = (stimulus_array, position_array,delay,duration) => {
        return new Promise(async (resolve, reject) => {

        this.jsPsych.pluginAPI.setTimeout(async function () {
          for (let istim = 0; istim < stimulus_array.length; istim++) { // show stimuli with response
            await draw_stim(stimulus_array[istim], position_array[istim]);
          }
          this.jsPsych.pluginAPI.setTimeout(function () { // clear screen
            clear_screen();
            resolve();
          },
            duration);
        },
        delay);
      })};


      // MAIN TRIAL PROCEDURE HERE

      const trial_procedure = async () => {

      // CREATE STIMULI for set 1

      let stimulus_array_1 = [];
      let stims_shuff_1 = shuffleArray(trial.stimuli_1);

      // if manual stimuli are set, use those
      if (trial.stim_manual_1.length > 0) {
        for (let i = 0; i < trial.set_size_1; i++) {
          stimulus_array_1.push(trial.stim_manual_1[i]);
        }
      } else {
        for (let i = 0; i < trial.set_size_1; i++) { // append stimuli (should be already shuffled)
          stimulus_array_1.push(stims_shuff_1[i]);
        }
      }

      // CREATE STIMULI for set 2

      let stimulus_array_2 = [];
      let stims_shuff_2 = shuffleArray(trial.stimuli_2);


      // if manual stimuli are set, use those
      if (trial.stim_manual_2.length > 0) {
        for (let i = 0; i < trial.set_size_2; i++) {
          stimulus_array_2.push(trial.stim_manual_2[i]);
        }
      } else {
        for (let i = 0; i < trial.set_size_2; i++) { // append stimuli (should be already shuffled)
          stimulus_array_2.push(stims_shuff_2[i]);
        }
      }

      // GET POSITION ARRAYS

      let position_array_1;
      let position_array_2;

      [position_array_1, position_array_2] = await Promise.all([
        assign_positions(trial.set_size_1,trial.pos_manual_1),
        assign_positions(trial.set_size_2,trial.pos_manual_2)]);

        // initialize trial_data for use later
        let trial_data = [
          {
            stimulus_array: stimulus_array_1,
            position_array: position_array_1,
            response_array: response_array_1,
            valid_stimuli: trial.stimuli_1,
            key: null,
            rt: null,
            correct_answer: null,
            accuracy: null,
            test_index: null,
            test_item: null,
          },
          {
            stimulus_array: stimulus_array_2,
            position_array: position_array_2,
            response_array: response_array_2,
            valid_stimuli: trial.stimuli_2,
            key: null,
            rt: null,
            correct_answer: null,
            accuracy: null,
            test_index: null,
            test_item: null,
          },
        ]

        show_fixation();

        // stim 1 
        await present_stimuli(
          trial_data[0].stimulus_array,
          trial_data[0].position_array,
          trial.fixation_duration,
          trial.stim_duration_1
        )
        await present_stimuli(
            trial_data[1].stimulus_array,
            trial_data[1].position_array,
            trial.isi,
            trial.stim_duration_2
          )

        // stim 2
        

        // delay and first test

        // test the first probe as set by probe order

        var probe_ix = trial.probe_order[0];

       [trial_data[probe_ix].response_array,trial_data[probe_ix].test_index,trial_data[probe_ix].test_item] = await present_test(
          trial_data[probe_ix].stimulus_array,
          trial_data[probe_ix].position_array,
          trial_data[probe_ix].response_array,
          trial_data[probe_ix].valid_stimuli,
          trial.delay_duration
        );

        // wait for a response here
        var keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: async (info) => {

            // save out data
            trial_data[probe_ix].key = info.key
            trial_data[probe_ix].rt = info.rt
            trial_data[probe_ix].correct_answer = String(trial_data[probe_ix].response_array[trial_data[probe_ix].test_index]);
            trial_data[probe_ix].accuracy = info.key === trial_data[probe_ix].correct_answer




            // then test the second probe
            clear_screen();
            probe_ix = trial.probe_order[1];
            

            [trial_data[probe_ix].response_array,trial_data[probe_ix].test_index,trial_data[probe_ix].test_item] = await present_test(
              trial_data[probe_ix].stimulus_array,
              trial_data[probe_ix].position_array,
              trial_data[probe_ix].response_array,
              trial_data[probe_ix].valid_stimuli,
              trial.delay_duration
            );


            // second keyboard response here (sorry for ugly)
            var keyboard_listener_2 = this.jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: async function (info) {
                trial_data[probe_ix].key = info.key
                trial_data[probe_ix].rt = info.rt
                trial_data[probe_ix].correct_answer = String(trial_data[probe_ix].response_array[trial_data[probe_ix].test_index]);
                trial_data[probe_ix].accuracy = info.key === trial_data[probe_ix].correct_answer

                // end trial
                end_trial(trial_data);
              },
              valid_responses: trial_data[probe_ix].response_array.map(String), // this is for the second one
              rt_method: "performance",
              persist: false,
              allow_held_key: false,
            });

            
            },
          valid_responses: trial_data[probe_ix].response_array.map(String), // this is for the first one
          rt_method: "performance",
          persist: false,
          allow_held_key: false,
        });
      }

      // start the trial
      trial_procedure();
      



      const end_trial = (input_data) => {

        // remove event listeners
        $(document).unbind();
        // data saving
        // let accuracy = jsPsych.pluginAPI.compareKeys(key, String(response_array[test_index]));
        

        // save data into trial_data
        var trial_data = {
          trial_exp: trial.trial_exp,
          set_size_1: trial.set_size_1,
          stimuli_1: input_data[0].stimulus_array,
          positions_1: input_data[0].position_array,
          response_array_1: input_data[0].response_array,
          test_index_1: input_data[0].test_index,
          test_item_1: input_data[0].test_item,
          correct_answer_1: input_data[0].correct_answer,
          key_1: input_data[0].key,
          rt_1: input_data[0].rt,
          accuracy_1: input_data[0].accuracy,

          set_size_2: trial.set_size_2,
          stimuli_2: input_data[1].stimulus_array,
          positions_2: input_data[1].position_array,
          response_array_2: input_data[1].response_array,
          test_index_2: input_data[1].test_index,
          test_item_2: input_data[1].test_item,
          correct_answer_2: input_data[1].correct_answer,
          key_2: input_data[1].key,
          rt_2: input_data[1].rt,
          accuracy_2: input_data[1].accuracy,
        };

        console.log(trial_data)
        // end trial and go to next
        this.jsPsych.finishTrial(trial_data);
      }
    }
  }
  DualChangeLocPlugin.info = info;

  return DualChangeLocPlugin;
})(jsPsychModule);