//helper functions go here

// simple range
function range(start = 0, end) {
  return [...Array(end - start).keys()].map((i) => i + start);
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
  ixs = [...Array(arr.length).keys()];
  let newArr = [];
  while (ixs.length) {
    let i = Math.floor(Math.random() * ixs.length);
    newArr.push(arr[ixs.splice(i, 1)]);
  }
  return newArr;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

var jsPsychChangeDetection = (function (jsPsych) {
  "use strict";

  const info = {
    name: "ChangeDetectionPlugin",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /** The duration of fixation prior to stimulus presentation */
      fixation_duration: {
        type: jsPsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Fixation duration",
      },
      /** The number of TOTAL stimuli to show in the stimulus display*/
      set_size: {
        type: jsPsych.ParameterType.INT,
        default: 6,
        pretty_name: "Number of stimuli",
      },

      /** Stimuli which can appear. Either hex colors or paths to images */
      stimuli: {
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

      /** Stimuli to present in the trial (override) */
      stim_manual: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set stimuli",
        default: [],
      },

      /** Locations to present stimuli at during the trial (override) */

      pos_manual: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manually set positions",
        default: [],
      },

      /** The duration of the stimulus display */
      stim_duration: {
        type: jsPsych.ParameterType.INT,
        default: 250,
        pretty_name: "Stimulus duration",
      },

      /** the duration of the delay period (ms) */

      delay_duration: {
        type: jsPsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Delay duration",
      },

      /** Probe stimulus to present (override) */
      probe_manual: {
        type: jsPsych.ParameterType.STRING,
        pretty_name: "Manual probe",
        default: null,
      },

      /** Locations to present stimuli at during the trial (override) */

      probe_pos_manual: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Manual probe position",
        default: [],
      },

      /** Whether the test stimulus should be the same or different as the previous one (override) */

      change: {
        type: jsPsych.ParameterType.BOOL,
        pretty_name: "Change",
        default: null,
      },

      /** Response keys to press. First key is no change, second is change */

      keys: {
        type: jsPsych.ParameterType.OBJECT,
        pretty_name: "Response Keys",
        default: ["z", "/"],
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
      },

      /** Whether to show feedback */
      do_feedback: {
        type: jsPsych.ParameterType.BOOL,
        default: false,
      },
    },
    data: {
      /** Response key pressed */
      key: {
        type: jsPsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt: {
        type: jsPsych.ParameterType.INT,
      },

      /** Stims presented */
      stimuli: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Stim positions */
      positions: {
        type: jsPsych.ParameterType.OBJECT,
      },

      /** Index of the test */
      test_index: {
        type: jsPsych.ParameterType.INT,
      },
      /** Test item */
      test_item: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Correct answer */
      correct_answer: {
        type: jsPsych.ParameterType.STRING,
      },
      /** Number of stimuli */
      set_size: {
        type: jsPsych.ParameterType.INT,
      },
      /** Change present? */
      change: {
        type: jsPsych.ParameterType.BOOL,
      },
      /** Accuracy */
      accuracy: {
        type: jsPsych.ParameterType.BOOL,
      },
      /** Name of trial */
      trial_exp: {
        type: jsPsych.ParameterType.STRING,
        default: "change_detection",
      },
    },
  };

  /**
   * **{plugin-changedetect-single}**
   *
   * A plugin to run change localization experiments of varying set sizes
   * Display stimuli simultaneously, then test on a array of the same with one changed
   * Can run with colors or images
   *
   * @author Darius Suplica
   * @see {@link {https://github.com/dsuplica/working-memory-jsPsych-plugins}}
   */
  class ChangeDetectionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // CHECKS IF OVERRIDES ARE SET and set set_size appropriately if so

      if (
        trial.stim_manual.length > 0 &&
        trial.pos_manual.length > 0 &&
        trial.stim_manual.length !== trial.pos_manual.length
      ) {
        throw new Error("Stimulus array length does not match set size");
      } else if (trial.stim_manual.length > 0) {
        trial.set_size = trial.stim_manual.length;
      } else if (trial.pos_manual.length > 0) {
        trial.set_size = trial.pos_manual.length;
      }

      let test_index; // index of item to be changed
      let test_item; // new value for changed item

      const canvasSize = trial.graphics.canvasSize;
      const edge_buffer = trial.graphics.edge_buffer;
      const stim_buffer = trial.graphics.stim_buffer;
      const stim_size = trial.graphics.stim_size;

      // MAIN EXPERIMENT CODE

      //CREATE CANVAS OBJECT//
      display_element.innerHTML =
        "<div id='jsPsych-changedetect-plugin' style='position: relative; width:" +
        canvasSize +
        "px; height:" +
        canvasSize +
        "px'></div>";
      display_element.querySelector("#jsPsych-changedetect-plugin").innerHTML +=
        "<canvas id='c', width = '" +
        canvasSize +
        "', height = '" +
        canvasSize +
        "'/canvas>";

      //CREATE FABRIC OBJECT//
      var canvas = new fabric.Canvas("c");
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

      // if manual positions are set, use those
      if (trial.pos_manual.length > 0) {
        for (let i = 0; i < trial.set_size; i++) {
          position_array.push(trial.pos_manual[i]);
        }
      } else {
        const stim_diag = Math.sqrt(2) * stim_size; // diagonal distance

        let i = 0;
        let loop_counter = 0;
        position_loop: while (position_array.length < trial.set_size) {
          i++;

          // avoid infinite while loop
          if (i > 1000) {
            if (loop_counter > 1000) {
              // this exists so we don't get stuck in an infinite loop. This is bad if it runs
              alert(
                "POSITION ASSIGNMENT ERROR: Please contact your experimenter."
              );
              throw new Error("Could not find valid positions");
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

          if (
            dist_between_points(x, y, canvasSize / 2, canvasSize / 2) <
            stim_diag + stim_buffer
          ) {
            continue position_loop; // too close to center
          }

          if (position_array.length > 0) {
            for ([x2, y2] of position_array) {
              if (
                dist_between_points(x, y, x2, y2) <
                stim_diag * 2 + stim_buffer
              ) {
                continue position_loop; // too close to another stimulus
              }
            }
          }

          // Add the position to the array if it passes the check
          position_array.push([x, y]);
        }
      }

      // CREATE STIMULI

      let stimulus_array = [];
      let stims_shuff = shuffleArray(trial.stimuli);

      // if manual stimuli are set, use those
      if (trial.stim_manual.length > 0) {
        for (let i = 0; i < trial.set_size; i++) {
          stimulus_array.push(trial.stim_manual[i]);
        }
      } else {
        for (let i = 0; i < trial.set_size; i++) {
          // append stimuli (should be already shuffled)
          stimulus_array.push(stims_shuff[i]);
        }
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

            resolve();
          });
        });
      };

      const draw_stim = async (stimulus, pos) => {
        let pattern = /^#/;
        let is_color = pattern.test(stimulus); // SEARCH FOR '#' IN STIMULUS ARGUMENT TO CONFIRM STIMULUS IS A COLOR
        if (is_color) {
          await draw_colored_square(stimulus, pos);
        } else {
          await draw_image(stimulus, pos);
        }
      };

      const clear_screen = () => {
        // remove all stimuli on screen
        canvas.getObjects().forEach((o) => {
          if (!o.id) {
            canvas.remove(o);
          }
        });
        canvas.requestRenderAll();
      };

      const present_test = () => {
        // pick an item to test
        test_index = randomInt(0, stimulus_array.length);

        // pick values here

        // manual probe
        if (trial.probe_manual !== null) {
          test_item = trial.probe_manual;
          if (!stimulus_array.includes(test_item)) {
            // unexpected? will always overwrite change. also doesn't check positions
            trial.change = true;
          } else {
            trial.change = false;
          }
        } else {
          if (trial.change === null) {
            trial.change = Math.random() < 0.5; // if change is not set, randomly assign
          }

          if (trial.change) {
            test_item = randChoice(
              trial.stimuli.filter((x) => !stimulus_array.includes(x))
            ); // if change, pick a new item
          } else {
            test_item = stimulus_array[test_index]; // if no change, pick the existing item
          }
        }

        if (trial.probe_pos_manual.length > 0) {
          // probe position
          if (trial.probe_pos_manual.length !== 2) {
            throw new Error("Probe position array must have ONLY two values");
          }

          var probe_position = trial.probe_pos_manual;
        } else {
          var probe_position = position_array[test_index]; // otherwise pick the corresponding location
        }

        // present probe here

        draw_stim(test_item, probe_position);

        // event listener
        var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: afterResponse,
          valid_responses: trial.keys,
          rt_method: "performance",
          persist: false,
          allow_held_key: false,
        });
      };

      const present_stimuli = (
        stimulus_array,
        position_array,
        delay,
        duration
      ) => {
        return new Promise(async (resolve, reject) => {
          this.jsPsych.pluginAPI.setTimeout(async function () {
            for (let istim = 0; istim < stimulus_array.length; istim++) {
              // show stimuli with response
              await draw_stim(stimulus_array[istim], position_array[istim]);
            }
            this.jsPsych.pluginAPI.setTimeout(function () {
              // clear screen
              clear_screen();
              resolve();
            }, duration);
          }, delay);
        });
      };

      // MAIN TRIAL PROCEDURE HERE

      const trial_procedure = async () => {
        await present_stimuli(
          stimulus_array,
          position_array,
          trial.fixation_duration,
          trial.stim_duration
        );

        this.jsPsych.pluginAPI.setTimeout(function () {
          present_test();
        }, trial.delay_duration);
      };

      // RUN HERE
      show_fixation();
      this.jsPsych.pluginAPI.setTimeout(function () {
        //INTERTRIAL INTERVAL then run trial
        trial_procedure();
      }, trial.fixation_duration);

      function afterResponse(info) {
        end_trial(info.key, info.rt);
      }

      const end_trial = (key, rt) => {
        // remove event listeners
        $(document).unbind();
        // data saving
        // accuracy: first key is no change second is change

        if (trial.change) {
          var correct_answer = trial.keys[1];
        } else {
          var correct_answer = trial.keys[0];
        }

        let accuracy = key === correct_answer;

        var trial_data = {
          trial_exp: trial.trial_exp,
          key: key,
          rt: rt,
          stimuli: stimulus_array,
          positions: position_array,
          test_index: test_index,
          test_item: test_item,
          correct_answer: correct_answer, //CHANGE
          change: trial.change,
          set_size: trial.set_size,
          accuracy: accuracy,
        };
        console.log(trial_data);
        // display feedback

        if (trial.do_feedback) {
          canvas.getObjects().forEach((o) => {
            canvas.remove(o);
          });
          canvas.requestRenderAll();

          let feedback_text = accuracy ? "Correct" : "Incorrect";
          console.log(feedback_text);

          let feedback = new fabric.Text(feedback_text, {
            id: "feedback",
            fill: "#FFFFFF",
            fontSize: 50,
            hasBorders: false,
            hasControls: false,
            hoverCursor: "default",
            lockMovementX: true,
            lockMovementY: true,
          });
          canvas.add(feedback);
          feedback.center();

          canvas.requestRenderAll();

          this.jsPsych.pluginAPI.setTimeout(function () {
            canvas.remove(feedback);
            canvas.requestRenderAll();
            this.jsPsych.finishTrial(trial_data);
          }, 500);
        } else {
          // end trial and go to next
          this.jsPsych.finishTrial(trial_data);
        }
      };
    }
  }
  ChangeDetectionPlugin.info = info;

  return ChangeDetectionPlugin;
})(jsPsychModule);
