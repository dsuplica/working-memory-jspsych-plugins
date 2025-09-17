// A simple plugin to run a visual search experiment with target letters
// Darius Suplica, dsuplica@uchicago.edu 2025-07-07

//helper functions go here

// simple range
function range(start = 0, end) {
  return [...Array(end - start).keys()].map((i) => i + start);
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
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
const pi = Math.PI;

var jsPsychVisualSearch = (function (jspsych) {
  "use strict";

  const info = {
    name: "VisualSearchPlugin",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /** The duration of fixation prior to stimulus presentation */
      fixation_duration: {
        type: jspsych.ParameterType.INT,
        default: 1000,
        pretty_name: "Fixation duration",
      },

      /**The target letter to use */

      target_stim: {
        type: jspsych.ParameterType.STRING,
        default: "T",
        pretty_name: "Target Stimulus",
      },
      /** placeholder letters to sample from */
      distractor_stims: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: ["L", "L", "L", "L", "L", "L", "L", "L"],
        pretty_name: "Placeholder stimuli",
      },
      /** the number of PLACEHOLDERS to show in addition to the one target */
      n_placeholders: {
        type: jspsych.ParameterType.INT,
        default: 5,
        pretty_name: "Number of distractors",
      },

      /** Valid centers for position bins. Uses polar coordinates */
      pos_bin_centers: {
        type: jspsych.ParameterType.OBJECT,
        default: {
          left: [
            [100, (-3 * pi) / 4],
            [100, -pi],
            [100, (3 * pi) / 4],
          ],
          right: [
            [100, -pi / 4],
            [100, 0],
            [100, pi / 4],
          ],
        },
      },

      pos_jitter: {
        type: jspsych.ParameterType.OBJECT,
        default: {
          r: 50, // px
          theta: pi / 12, // radians
        },
      },

      correct_responses: {
        type: jspsych.ParameterType.OBJECT,
        default: {
          left: "z", // left side
          right: "/", // right side
        },
      },

      trial_exp: {
        type: jspsych.ParameterType.STRING,
        default: "visual-search",
        pretty_name: "Trial experiment name",
      },

      rotate_stimuli: {
        type: jspsych.ParameterType.BOOL,
        default: false,
        pretty_name: "Rotate stimuli?",
      },

      pre_trial_text: {
        type: jspsych.ParameterType.STRING,
        default: "Press space to start the trial",
        pretty_name: "Pre-trial text",
        description: "Text to display before the trial starts.",
      },

      graphics: {
        type: jspsych.ParameterType.OBJECT,
        default: {
          canvasSize: 600,
          edge_buffer: 100,
          stim_buffer: 50,
          stim_size: 40,
        },
      },
      max_trial_duration: {
        type: jspsych.ParameterType.INT,
        default: 2000,
        pretty_name: "Maximum trial duration",
        description: "Maximum duration of trial in ms",
      },
    },
    data: {
      /** name of this trial */

      /** Response key pressed */
      key: {
        type: jspsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt: {
        type: jspsych.ParameterType.INT,
      },

      /** Stims presented */
      stimuli: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Stim positions */
      positions: {
        type: jspsych.ParameterType.OBJECT,
      },

      target_lateralization: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Target lateralization",
      },

      /** Number of stimuli */
      set_size: {
        type: jspsych.ParameterType.INT,
      },
      /** Accuracy */
      accuracy: {
        type: jspsych.ParameterType.BOOL,
      },
      /** Name of trial */
      trial_exp: {
        type: jspsych.ParameterType.STRING,
        default: "visual-search",
      },
    },
  };

  /**
   * **{plugin-visualsearch-single}**
   *
   * A plugin to run change localization experiments of varying set sizes
   * Display stimuli simultaneously, then test on a array of the same with one changed
   * Can run with colors or images
   *
   * @author Darius Suplica
   *@see {@link {https://github.com/dsuplica/}}

   */
  class VisualSearchPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.jspsych = jsPsych; // because im stupid
    }

    trial(display_element, trial) {
      var correct_response = trial.correct_responses;
      var valid_responses = Object.values(correct_response);
      const canvasSize = trial.graphics.canvasSize;
      const edge_buffer = trial.graphics.edge_buffer;
      const stim_buffer = trial.graphics.stim_buffer;
      const stim_size = trial.graphics.stim_size;

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
        backgroundColor: graphics.background_color || "#9E9E9E",
      });

      function show_fixation() {
        //SHOW FIXATION CROSS//
        let fixation = new fabric.Text("+", {
          id: "fixation",
          fill: graphics.fixation_color || "#000000",
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

      // CREATE STIMULI

      let locations = Object.keys(trial.pos_bin_centers);
      let distractors = shuffleArray(trial.distractor_stims);

      if (trial.target_lateralization === undefined) {
        var target_lateralization = locations[randomInt(0, locations.length)]; // assign at random
      } else {
        var target_lateralization = trial.target_lateralization; // use provided value
      }

      // assign stimuli
      var stimulus_array = [trial.target_stim].concat(
        distractors.slice(0, trial.n_placeholders)
      );

      // assign rotations if set

      if (trial.rotate_stimuli) {
        var stim_angles = stimulus_array.map((x) => randomInt(10, 350)); // assign randomly but not upright
      } else {
        var stim_angles = stimulus_array.map((x) => 0); // no rotation
      }

      // randomize order of position bins

      var bins_to_sample = Object.fromEntries(
        Object.entries(trial.pos_bin_centers).map(([k, v]) => [
          k,
          shuffleArray(v),
        ])
      ); // shuffle each element

      // NOW ASSIGN POSITIONS

      // ASSIGN LOCATION BINS

      // assign location bin for target letter
      var bin_array = [];
      bin_array.push(bins_to_sample[target_lateralization].splice(0, 1)[0]);
      var distractor_choices = shuffleArray(Object.keys(bins_to_sample));
      distractor_choices.splice(
        distractor_choices.indexOf(target_lateralization),
        1
      ); // remove target side from choices

      while (bin_array.length < trial.n_placeholders + 1) {
        if (distractor_choices.length == 0) {
          distractor_choices = shuffleArray(Object.keys(bins_to_sample));
        }

        let side = distractor_choices.splice(0, 1)[0]; // take one side
        bin_array.push(bins_to_sample[side].splice(0, 1)[0]);
      }

      var position_array = bin_array.map((bin) => {
        // console.log(bin);
        let r = bin[0] + randomFloat(-trial.pos_jitter.r, trial.pos_jitter.r);
        let theta =
          bin[1] + randomFloat(-trial.pos_jitter.theta, trial.pos_jitter.theta);

        return [
          canvasSize / 2 + r * Math.cos(theta),
          canvasSize / 2 + r * Math.sin(theta),
        ];
      });

      ///// END OLD CODE

      // CONVERT BINS INTO COORDINATES

      const draw_text = (letter, pos, angle) => {
        // console.log(pos);
        return new Promise((resolve, reject) => {
          var text = new fabric.Text(letter, {
            left: pos[0], // shift to convert from
            top: pos[1],
            angle: angle || 0, // if no angle provided, use 0
            originX: "center",
            originY: "center",
            fill: "#000000",
            fontFamily: "Arial",
            width: stim_size,
            hasBorders: false,
            hasControls: false,
            hoverCursor: "default",
            lockMovementX: true,
            lockMovementY: true,
          });
          canvas.add(text);
          canvas.requestRenderAll();
          resolve();
        });
      };

      const draw_image = (image, pos, label) => {
        return new Promise((resolve, reject) => {
          fabric.Image.fromURL(image, function (img) {
            img.set({
              left: pos[0],
              top: pos[1],
              originX: "center",
              originY: "center",
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

      const draw_stim = async (stimulus, pos, rotation) => {
        let pattern = /\.jpg|\.png$/i;
        let is_letter = pattern.test(stimulus); // SEARCH for image file extension
        if (is_letter) {
          await draw_image(stimulus, pos, rotation);
        } else {
          await draw_text(stimulus, pos, rotation);
        }
      };

      const clear_screen = () => {
        canvas.getObjects().forEach((o) => {
          if (!o.id) {
            canvas.remove(o);
          }
        });
        canvas.requestRenderAll();
      };

      // MAIN TRIAL PROCEDURE HERE

      // RUN HERE

      const go = async () => {
        await draw_text(trial.pre_trial_text, [
          canvasSize / 2,
          canvasSize / 2 - 50,
        ]);

        var start_listener = jsPsych.pluginAPI.getKeyboardResponse({
          valid_responses: " ", // space bar
          rt_method: "performance",
          persist: false,
          allow_held_key: false,
          callback_function: run_trial,
        });
      };

      const run_trial = () => {
        canvas.remove(...canvas.getObjects());
        show_fixation();
        // wait fixation duration and present stimuli
        this.jsPsych.pluginAPI.setTimeout(async function () {
          for (let istim = 0; istim < stimulus_array.length; istim++) {
            // show stimuli with response
            await draw_stim(
              stimulus_array[istim],
              position_array[istim],
              stim_angles[istim]
            );
          }

          var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: afterResponse,
            valid_responses: valid_responses,
            rt_method: "performance",
            persist: false,
            allow_held_key: false,
            minimum_valid_rt: 50, // minimum RT to be considered valid
          });
        }, trial.fixation_duration);

        // wait max duration and end trial if no response

        if (trial.max_trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(function () {
            end_trial(null, null);
          }, trial.max_trial_duration);
        }
      };

      function afterResponse(info) {
        end_trial(info.key, info.rt);
      }

      go();

      const end_trial = (key, rt) => {
        // remove event listeners
        this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
        this.jsPsych.pluginAPI.clearAllTimeouts();
        // data saving
        // let accuracy = jsPsych.pluginAPI.compareKeys(key, String(response_array[test_index]));

        let accuracy = key === String(correct_response[target_lateralization]);
        var trial_data = {
          trial_exp: trial.trial_exp,
          key: key,
          rt: rt,
          prompt: trial.pre_trial_text,
          stimuli: stimulus_array,
          positions: position_array,
          rotations: stim_angles,
          target_lateralization: target_lateralization,
          set_size: stimulus_array.length,
          accuracy: accuracy,
        };
        console.log(trial_data);
        // end trial and go to next
        this.jsPsych.finishTrial(trial_data);
      };
    }
  }
  VisualSearchPlugin.info = info;

  return VisualSearchPlugin;
})(jsPsychModule);
