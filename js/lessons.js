// Recording and Signal Flow: lessons built from the YouTube course. Short, related videos share a lesson.
// videos: the lesson's videos in order ({id, title, short}). A question or task can point at one with
//   v (index into videos, default 0) and at (seconds into that video), for "Watch this part".
// Exercise kinds:
//   quiz  - questions with one right answer each; all right = passed
//   desk  - a task on the AWS 900 desk simulator (desk.html?task=ID); the desk says when it is done
//   exam  - the formative signal flow exam on the desk, scored per block (1 / 0.5 / 0)

const V = (id, title, short = false) => ({ id, title, short });

export const LESSONS = [
  // ---------------- Module 1: the live room ----------------
  { id: 'rec-01-cables', title: 'The live room and its cables',
    about: 'What the live room is for, why this course is about troubleshooting, and how to coil and lay out cables so they last and nobody trips.',
    videos: [V('J9bHo8-wrv4', 'Live room introduction', true), V('0dNItpUOTI4', 'Coiling XLR cables', true), V('DrCldD3CFJM', 'Laying out cables')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Cables', questions: [
        { q: 'What is the main goal of the signal flow course?', a: ['Being able to track where the signal is at any time, and fix it', 'Learning to mix', 'Choosing microphones'], ok: 0, v: 0, at: 10 },
        { q: 'Why do we coil over and under, alternating directions?', a: ['It looks tidier', 'Coiling one way builds conflicting twists in the wires: kinks, tangles and early wear', 'It is faster'], ok: 1, v: 1, at: 105 },
        { q: 'How big should the coil be?', a: ['The size of a fist', 'A bit bigger than a 7-inch (45) record', 'The size of an LP or bigger'], ok: 1, v: 1, at: 20 },
        { q: 'A mic is in use on its stand. Where does the spare cable go?', a: ['Across the floor to the tie box', 'Coiled at the feet of the stand, the rest taped down', 'Wrapped tightly round the mic'], ok: 1, v: 1, at: 140 },
        { q: 'A cable crosses a walkway. What do you do?', a: ['Leave it', 'Keep it on the floor and tape it down', 'Lift it over the walkway'], ok: 1, v: 2, at: 150 },
      ] }] },
  { id: 'rec-02-stands-mics', title: 'Stands and microphones',
    about: 'Undo each knob before you move a joint. Mics are the most fragile and expensive things in the room: first out when setting up, first back in when packing away.',
    videos: [V('zu0HapjfDxU', 'Handling studio stands', true), V('i2iVybE-4tY', 'Mic handling')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Stands and mics', questions: [
        { q: 'You want to lower the boom. What first?', a: ['Push it down firmly', 'Undo the knob on that joint, move it, then retighten', 'Take the mic off'], ok: 1, v: 0, at: 25 },
        { q: 'What happens to a stand whose joints are forced?', a: ['Nothing', 'The knob wears loose and a heavy mic drifts down however hard you tighten it', 'It gets stiffer'], ok: 1, v: 0, at: 60 },
        { q: 'Packing up the studio: what goes first?', a: ['Cables', 'Stands', 'Microphones, back in their box'], ok: 2, v: 1, at: 45 },
        { q: 'Fitting the holder: what do you turn?', a: ['The joint, into the holder', 'The holder onto the joint'], ok: 0, v: 1, at: 70 },
        { q: 'Before plugging a condenser (TLM) in at the tie box, you ask the engineer…', a: ['Is the fader up?', 'Is the phantom power (48V) off?', 'Is the gain up?'], ok: 1, v: 1, at: 125 },
      ] }] },
  { id: 'rec-03-tie-box', title: 'The tie box and talking between rooms',
    about: 'Numbered and labelled tie box channels, the headphone amp in the live room, and a separate mic and headphones for the crew, because the live room has no talkback of its own.',
    videos: [V('e7fP5am8_9Y', 'The tie box'), V('5XL4S37oX0o', 'Communication between rooms', true)],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Tie box', questions: [
        { q: 'The engineer asks for the vocal on channel 1. What do you write on the tape?', a: ['VX', 'CH', 'MIC'], ok: 0, v: 0, at: 30 },
        { q: 'You are about to plug the vocal mic into the tie box. What do you check?', a: ['That phantom power is off', 'That the speakers are loud', 'Nothing'], ok: 0, v: 0, at: 82 },
      ] },
      { id: 'plug', kind: 'desk', task: 'plug', title: 'Plug the vocal in at the tie box', v: 0, at: 82 },
      { id: 'talkback', kind: 'desk', task: 'talkback', title: 'Talk to the musician', v: 1 }] },

  // ---------------- Module 2: control room signal flow ----------------
  { id: 'rec-04-gain-staging', title: 'Into the control room: gain staging',
    about: 'From the live room into the desk, to the computer and back to the speakers and headphones. Flip to MIC, 48V before any gain, then raise the red gain to just under the orange: metering stage 1.',
    videos: [V('dK0xHeA8lH0', 'Intro to the control room', true), V('qV4FFEFrOg4', 'Gain staging')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'The route', questions: [
        { q: 'Put the route in order.', a: ['Mic → tie box → desk → DAW → desk → speakers and headphones', 'Mic → DAW → desk → tie box → speakers', 'Mic → speakers → desk → DAW'], ok: 0, v: 0 },
      ] },
      { id: 'gain', kind: 'desk', task: 'gain', title: 'Gain stage the vocal', v: 1, at: 60 },
      { id: 'rec-bus', kind: 'desk', task: 'rec-bus', title: 'Send it to the REC bus', v: 1, at: 180 }] },
  { id: 'rec-05-metering', title: 'Metering stages 1 to 4',
    about: 'Stage 1 the channel meter, 2 the DAW input, 3 the REC/MIX VU meters, 4 the monitor meter; then the speakers.',
    videos: [V('ZvhAN8syK0k', 'Signal flow metering stages 1 to 4')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'The four stages', questions: [
        { q: 'Metering stage 2 is…', a: ['The channel meter', 'The DAW input meter, once the fader is up', 'The VU meters'], ok: 1, at: 22 },
        { q: 'Metering stage 3 is…', a: ['The REC and MIX VU meters', 'The headphones', 'The monitor meter'], ok: 0, at: 125 },
        { q: 'Live room sounds go on the … bus, DAW returns on the … bus.', a: ['MIX, REC', 'REC, MIX'], ok: 1, at: 66 },
      ] },
      { id: 'monitor', kind: 'desk', task: 'monitor', title: 'Hear the REC bus in the control room', at: 300 }] },
  { id: 'rec-06-pro-tools', title: 'Pro Tools in and out',
    about: 'Track inputs mirror the console channels; outputs come back on free channels on the MIX bus, so you hear what is being recorded (confidence monitoring). Then name, arm and record.',
    videos: [V('GnN_hsSq-JQ', 'Setting up the DAW'), V('XkVQH966GJs', 'DAW signal flow'), V('STK_y69uPSI', 'Recording in Pro Tools', true)],
    exercises: [
      { id: 'daw-in', kind: 'desk', task: 'daw-in', title: 'Get the vocal into Pro Tools', v: 0, at: 60 },
      { id: 'daw-return', kind: 'desk', task: 'daw-return', title: 'Return the DAW on channel 5 and monitor MIX', v: 1, at: 66 },
      { id: 'record', kind: 'desk', task: 'record', title: 'Record a pass while monitoring off-tape', v: 2, at: 100 }] },
  { id: 'rec-07-troubleshooting', title: 'REC bus and troubleshooting',
    about: 'All live-room mics to the REC bus, and finding the channels that do not work. Allow the first 30 to 60 minutes of a session for this.',
    videos: [V('WmgjKw1zvU4', 'REC bus signal flow and troubleshooting')],
    exercises: [
      { id: 'trouble', kind: 'desk', task: 'trouble', title: 'Find out why channel 2 is silent', at: 120 }] },
  { id: 'rec-08-cues', title: 'Cues and foldback',
    about: 'DAW returns on MIX, talkback, the headphone amp, cue sends, the ST CUE A master and foldback A, which can also pick the REC or MIX bus directly. Meter it with solo before the headphones.',
    videos: [V('2K6j2JzxagU', 'Mix bus setup, cues and foldbacks'), V('kyXa2p-bQKA', 'Cue mix and foldback assignments')],
    exercises: [
      { id: 'cue', kind: 'desk', task: 'cue', title: 'A cue mix for the singer', v: 0, at: 160 },
      { id: 'click', kind: 'desk', task: 'click', title: 'Click in the cue only', v: 1, at: 60 }] },
  { id: 'rec-09-patchbay', title: 'Headphones, the patchbay and track buses',
    about: 'Foldback to the headphone amp. Patchbay: top row outputs, bottom row inputs; normal breaks, half-normal does not. Track buses combine channels onto one DAW track or feed effects.',
    videos: [V('JqIVe8EGMqg', 'Sound to headphones and patchbay logic', true), V('vWgswdrGNv4', 'Track buses', true)],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Patchbay', questions: [
        { q: 'On the patchbay, the top row is…', a: ['Inputs', 'Outputs'], ok: 1, v: 0, at: 50 },
        { q: 'You plug into a fully normalled point. The original signal…', a: ['Carries on as well', 'Is broken: it only goes where you patched it'], ok: 1, v: 0, at: 62 },
        { q: 'A half-normal point…', a: ['Breaks the signal', 'Lets you take a copy while it carries on to where it went'], ok: 1, v: 0, at: 80 },
      ] },
      { id: 'trk-bus', kind: 'desk', task: 'trk-bus', title: 'Two channels onto track bus 1 into DAW 7', v: 1 }] },
  { id: 'rec-10-exam', title: 'Signal flow exam (formative)', videos: [],
    about: 'The whole session from live room to control room, scored block by block like the real exam: 1 done right, 0.5 partly done, 0 for a fundamental error.',
    exercises: [
      { id: 'exam', kind: 'exam', title: 'Signal flow exam' }] },

  // ---------------- Module 3: microphones (exercises coming) ----------------
  { id: 'rec-11-mics', title: 'Know your microphones',
    videos: [V('ICNPXxQg8R8', 'Get to know your microphones, part 1', true), V('A77CBVs-BMQ', 'Get to know your microphones, part 2'), V('jyEOxcnQIi8', 'The classic microphones', true)], exercises: [] },
  { id: 'rec-12-polar', title: 'Polar patterns', videos: [V('mQWlWDs1xB8', 'Microphone polar patterns')], exercises: [] },
  { id: 'rec-13-stereo', title: 'Stereo techniques', videos: [V('hGUwGETPpsM', 'Stereo techniques')], exercises: [] },
  { id: 'rec-14-drums', title: 'Drum mic set-ups',
    videos: [V('8fcWrF76Lzc', 'Drum set-ups 1 and 2'), V('bA9uLt6YeAM', 'Drum set-up 3')], exercises: [] },

  // ---------------- Module 4: Pro Tools (exercises coming) ----------------
  { id: 'rec-15-pt-basics', title: 'Pro Tools basics', videos: [V('3Uhbk9pwecM', 'Basic Pro Tools operations')], exercises: [] },
  { id: 'rec-16-guide', title: 'Recording a guide track', videos: [V('My9ESC3yniY', 'Recording a guide track in Pro Tools')], exercises: [] },
  { id: 'rec-17-edits', title: 'Editing in Pro Tools', videos: [V('VlsrHsxXSH0', 'Edits in Pro Tools')], exercises: [] },
  { id: 'rec-18-comping', title: 'Comping drums',
    videos: [V('qs8geIyjiws', 'Drum comping'), V('pZav4i0Rbf4', 'Comping drums in depth')], exercises: [] },
  { id: 'rec-19-template', title: 'Mix template and automation',
    videos: [V('HEnGJ4PCYro', 'Pro Tools mix template'), V('YO0LBcWSRWs', 'Pro Tools automation')], exercises: [] },

  // ---------------- Module 5: mixing on the console (exercises coming) ----------------
  { id: 'rec-20-dyn-eq', title: 'In-console compressors and EQ', videos: [V('iV4s19G1C3w', 'In-console compressors and EQ')], exercises: [] },
  { id: 'rec-21-outboard', title: 'External reverb and compressor', videos: [V('RYRstfSd1HA', 'Reverb and compressor external')], exercises: [] },
  { id: 'rec-22-print', title: 'Print and export the mix',
    videos: [V('qdtjcm5g8XA', 'Print the mix'), V('J0eVmGYvDtw', 'Print the mix: quick version', true), V('TswRsK92Rq4', 'Exporting the stereo mix', true)], exercises: [] },
  { id: 'rec-23-atmos', title: 'Binaural listening and Dolby Atmos', videos: [V('1a6rh3AO1S8', 'Binaural listening and Dolby Atmos')], exercises: [] },
  // ---------------- Module 6: the Zen Master (unlocks when every exercise before it is done) ----------------
  { id: 'rec-24-final', title: 'The final test', videos: [], requires: 'all',
    about: 'Ten hard questions on the whole session, from the tie box to the shutdown. Get 9 of 10 right to pass, and Maestro Zen will receive you.',
    exercises: [
      { id: 'final', kind: 'quiz', title: 'Ten hard questions', pass: 9, questions: [
        { q: 'The mic is plugged in on wall box 1 and 48V is on, but channel 1 shows no signal. The channel is on LINE (FLIP unlit). Why?', a: ['The phantom power needs a minute to charge', 'On LINE the channel hears the line input (the DAW return), not the mic: press FLIP', 'The REC master is down'], ok: 1 },
        { q: 'Why switch 48V on before raising the gain, never after?', a: ['So the meter reads correctly', 'Phantom power arriving at high gain makes a loud thump through everything after the preamp: speakers, headphones, ears', 'Because the gain knob is disabled without 48V'], ok: 1 },
        { q: 'Channel 5 returns DAW track 1, whose input is channel 1. You route channel 5 to REC instead of MIX. What happens?', a: ['Nothing: REC and MIX are the same', 'The return goes back towards the recording and can loop into itself; and you no longer hear off-tape on the MIX bus', 'The take is recorded twice as loud'], ok: 1 },
        { q: 'What does off-tape (confidence) monitoring prove that monitoring the REC bus does not?', a: ['That the speakers work', 'That the signal really arrived in the DAW and came back: you hear what is recorded, not what you send', 'That the click is in time'], ok: 1 },
        { q: 'The singer\'s cue is sent POST fader from channel 5. You pull channel 5 down to talk to the producer. What does the singer hear?', a: ['The same cue as before', 'The vocal disappears from their headphones too: a cue for a performer should be pre-fader', 'Only the click'], ok: 1 },
        { q: 'ST CUE A AFL shows the vocal and F/B A AFL shows it too, but the singer hears nothing. Where is the fault?', a: ['On the channel cue send', 'After foldback A: the headphone amp (power, the headphones plugged in, the HP A level)', 'In the DAW'], ok: 1 },
        { q: 'The click comes back on channel 8 with CUE ON and MIX on. Why is that wrong?', a: ['It is not wrong', 'The click goes onto the MIX bus and ends up in the mix and the print: keep it in the cue only, MIX off', 'The click needs to be on REC'], ok: 1 },
        { q: 'You want the vocal and the snare on one DAW track. On the AWS you…', a: ['Patch both direct outs into one DAW input', 'Route both channels to the same track bus, raise that bus master and patch the bus output to the DAW input', 'Put both on the REC bus and FLIP'], ok: 1 },
        { q: 'You patch into a fully normalled point on the patchbay. What happens to the original signal?', a: ['It carries on as well as the new patch', 'It is broken: the signal now goes only where you patched it', 'It is doubled'], ok: 1 },
        { q: 'End of the session with a condenser on channel 1. The safe order is…', a: ['Unplug the mic, then switch 48V off, then the speakers', 'Speakers down or cut, 48V off and wait, then unplug the mic', '48V off, unplug, then the speakers'], ok: 1 },
      ] }] },
  { id: 'rec-25-zen', title: 'The challenge of Maestro Zen', videos: [], requires: 'rec-24-final',
    about: 'Three stages on the desk, no hints, no checklist. Maestro Zen is calm, and he forgives nothing: one fault (phantom power, feedback, a clipping preamp, the click in the mix) and the stage is lost. Pass all three and you are a Zen Recording Master.',
    exercises: [
      { id: 'zen1', kind: 'desk', task: 'zen1', title: 'Stage 1 · The silent take' },
      { id: 'zen2', kind: 'desk', task: 'zen2', title: 'Stage 2 · The singer\'s ears', after: 'zen1' },
      { id: 'zen3', kind: 'desk', task: 'zen3', title: 'Stage 3 · One take, no mistakes', after: 'zen2' }] },
];

export const findLesson = (id) => LESSONS.find((l) => l.id === id) || null;
export function findExercise(lessonId, exerciseId) {
  const lesson = findLesson(lessonId);
  return { lesson, exercise: lesson ? lesson.exercises.find((e) => e.id === exerciseId) || null : null };
}
export const KIND_LABELS = { quiz: 'Questions', desk: 'On the desk', exam: 'Exam' };
