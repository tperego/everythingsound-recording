// Recording and Signal Flow: every lesson, in the order of the YouTube course.
// Exercise kinds:
//   quiz  - questions with one right answer each; all right = passed
//   desk  - a task on the AWS 900 desk simulator (desk.html?task=ID); the desk says when it is done
//   exam  - the formative signal flow exam on the desk, scored per block (1 / 0.5 / 0)
// videoAt: seconds into the lesson video, for "Watch this part".

const yt = (id) => id;

export const LESSONS = [
  // ---------------- Module 1: the live room ----------------
  { id: 'rec-01-live-room', title: 'The live room', youtubeId: yt('J9bHo8-wrv4'), short: true,
    about: 'What happens in the live room and why the course is about troubleshooting: knowing where the signal is at every moment.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Why we are here', questions: [
        { q: 'What is the main goal of the signal flow course?', a: ['Being able to track where the signal is at any time, and fix it', 'Learning to mix', 'Choosing microphones'], ok: 0 },
        { q: 'Where are the console, the computers and the effects?', a: ['In the live room', 'In the control room', 'In the machine room'], ok: 1 },
      ] }] },
  { id: 'rec-02-coiling', title: 'Coiling XLR cables', youtubeId: yt('0dNItpUOTI4'), short: true,
    about: 'Over-under coiling: why it keeps cables alive, the right size of coil, and where the spare cable goes.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Coiling', questions: [
        { q: 'Why do we coil over and under, alternating directions?', a: ['It looks tidier', 'Coiling one way builds conflicting twists in the wires: kinks, tangles and early wear', 'It is faster'], ok: 1, at: 105 },
        { q: 'How big should the coil be?', a: ['The size of a fist', 'A bit bigger than a 7-inch (45) record', 'The size of an LP or bigger'], ok: 1, at: 20 },
        { q: 'A mic is in use on its stand. Where does the spare cable go?', a: ['Across the floor to the tie box', 'Coiled at the feet of the stand, the rest taped down', 'Wrapped tightly round the mic'], ok: 1, at: 140 },
      ] }] },
  { id: 'rec-03-stands', title: 'Handling studio stands', youtubeId: yt('zu0HapjfDxU'), short: true,
    about: 'Undo each knob before you move a joint, retighten after. Loose knobs drop heavy mics.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Stands', questions: [
        { q: 'You want to lower the boom. What first?', a: ['Push it down firmly', 'Undo the knob on that joint, move it, then retighten', 'Take the mic off'], ok: 1, at: 25 },
        { q: 'What happens to a stand whose joints are forced?', a: ['Nothing', 'The knob wears loose and a heavy mic drifts down however hard you tighten it', 'It gets stiffer'], ok: 1, at: 60 },
        { q: 'Where do unused stands go?', a: ['Folded, at the side of the room, ready to grab', 'In the middle of the room', 'Behind the drum kit'], ok: 0, at: 80 },
      ] }] },
  { id: 'rec-04-mic-handling', title: 'Mic handling', youtubeId: yt('i2iVybE-4tY'),
    about: 'Mics are the most fragile and expensive things in the studio: first out of the box when setting up the engineer\'s choice, first back in when packing away.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Mic handling', questions: [
        { q: 'Packing up the studio: what goes first?', a: ['Cables', 'Stands', 'Microphones, back in their box'], ok: 2, at: 45 },
        { q: 'Fitting the holder: what do you turn?', a: ['The joint, into the holder', 'The holder onto the joint'], ok: 0, at: 70 },
        { q: 'Before plugging a condenser (TLM) in at the tie box, you ask the engineer…', a: ['Is the fader up?', 'Is the phantom power (48V) off?', 'Is the gain up?'], ok: 1, at: 125 },
      ] }] },
  { id: 'rec-05-tie-box', title: 'The tie box', youtubeId: yt('e7fP5am8_9Y'),
    about: 'Numbered tie box channels, labelling them, and the headphone amp in the live room.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Tie box', questions: [
        { q: 'The engineer asks for the vocal on channel 1. What do you write on the tape?', a: ['VX', 'CH', 'MIC'], ok: 0, at: 30 },
        { q: 'You are about to plug the vocal mic into the tie box. What do you check?', a: ['That phantom power is off', 'That the speakers are loud', 'Nothing'], ok: 0, at: 82 },
      ] },
      { id: 'd', kind: 'desk', task: 'plug', title: 'Plug the vocal in at the tie box', at: 82 }] },
  { id: 'rec-06-laying-cables', title: 'Laying out cables', youtubeId: yt('DrCldD3CFJM'),
    about: 'Extensions to the tie box, one channel per mic, tidy and taped runs nobody can trip over.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Cable runs', questions: [
        { q: 'A cable crosses a walkway. What do you do?', a: ['Leave it', 'Keep it on the floor and tape it down', 'Lift it over the walkway'], ok: 1 },
      ] }] },
  { id: 'rec-07-comms', title: 'Talking between rooms', youtubeId: yt('5XL4S37oX0o'), short: true,
    about: 'A separate mic and headphones in the live room for the crew, because the live room has no talkback of its own.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'talkback', title: 'Talk to the musician' }] },

  // ---------------- Module 2: control room signal flow ----------------
  { id: 'rec-08-control-room', title: 'The control room', youtubeId: yt('dK0xHeA8lH0'), short: true,
    about: 'From the live room into the desk, to the computer and back to the speakers and headphones. Taught on the SSL AWS 900.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'The route', questions: [
        { q: 'Put the route in order.', a: ['Mic → tie box → desk → DAW → desk → speakers and headphones', 'Mic → DAW → desk → tie box → speakers', 'Mic → speakers → desk → DAW'], ok: 0 },
      ] }] },
  { id: 'rec-09-gain-staging', title: 'Gain staging', youtubeId: yt('qV4FFEFrOg4'),
    about: 'Flip to MIC, 48V before any gain, then raise the red gain to just under the orange: metering stage 1.',
    exercises: [
      { id: 'd1', kind: 'desk', task: 'gain', title: 'Gain stage the vocal', at: 60 },
      { id: 'd2', kind: 'desk', task: 'rec-bus', title: 'Send it to the REC bus', at: 180 }] },
  { id: 'rec-10-metering', title: 'Metering stages 1 to 4', youtubeId: yt('ZvhAN8syK0k'),
    about: 'Stage 1 the channel meter, 2 the DAW input, 3 the REC/MIX VU meters, 4 the monitor meter; then the speakers.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'The four stages', questions: [
        { q: 'Metering stage 2 is…', a: ['The channel meter', 'The DAW input meter, once the fader is up', 'The VU meters'], ok: 1, at: 22 },
        { q: 'Metering stage 3 is…', a: ['The REC and MIX VU meters', 'The headphones', 'The monitor meter'], ok: 0, at: 125 },
        { q: 'Live room sounds go on the … bus, DAW returns on the … bus.', a: ['MIX, REC', 'REC, MIX'], ok: 1, at: 66 },
      ] },
      { id: 'd', kind: 'desk', task: 'monitor', title: 'Hear the REC bus in the control room', at: 300 }] },
  { id: 'rec-11-daw-setup', title: 'Setting up the DAW', youtubeId: yt('GnN_hsSq-JQ'),
    about: 'Track inputs mirror the console channels; outputs come back on free channels for confidence monitoring.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'daw-in', title: 'Get the vocal into Pro Tools', at: 60 }] },
  { id: 'rec-12-daw-flow', title: 'DAW signal flow', youtubeId: yt('XkVQH966GJs'),
    about: 'Bring the DAW back on a line channel, put it on the MIX bus, and listen to what you are recording: confidence monitoring.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'daw-return', title: 'Return the DAW on channel 5 and monitor MIX', at: 66 }] },
  { id: 'rec-13-recording-pt', title: 'Recording in Pro Tools', youtubeId: yt('STK_y69uPSI'),
    about: 'Name the track, set its I/O, record on a new playlist, input monitor, arm and record.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'record', title: 'Record a pass while monitoring off-tape' }] },
  { id: 'rec-14-troubleshooting', title: 'REC bus and troubleshooting', youtubeId: yt('WmgjKw1zvU4'),
    about: 'All live-room mics to the REC bus, and finding the channels that do not work. Allow the first 30 to 60 minutes for this.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'trouble', title: 'Find out why channel 2 is silent', at: 120 }] },
  { id: 'rec-15-cues', title: 'Mix bus, cues and foldbacks', youtubeId: yt('2K6j2JzxagU'),
    about: 'DAW returns on MIX, talkback, the headphone amp, cue sends, the ST CUE A master and foldback A.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'cue', title: 'A cue mix for the singer', at: 160 }] },
  { id: 'rec-16-foldback', title: 'Cue mix and foldback assignments', youtubeId: yt('kyXa2p-bQKA'),
    about: 'Foldback A picks the cue, or the REC or MIX bus directly. Meter it with solo before the headphones.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'click', title: 'Click in the cue only', at: 60 }] },
  { id: 'rec-17-headphones', title: 'Headphones and patchbay logic', youtubeId: yt('JqIVe8EGMqg'), short: true,
    about: 'Foldback to the headphone amp. Patchbay: top row outputs, bottom row inputs; normal breaks, half-normal does not.',
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Patchbay', questions: [
        { q: 'On the patchbay, the top row is…', a: ['Inputs', 'Outputs'], ok: 1, at: 50 },
        { q: 'You plug into a fully normalled point. The original signal…', a: ['Carries on as well', 'Is broken: it only goes where you patched it'], ok: 1, at: 62 },
        { q: 'A half-normal point…', a: ['Breaks the signal', 'Lets you take a copy while it carries on to where it went'], ok: 1, at: 80 },
      ] }] },
  { id: 'rec-18-track-buses', title: 'Track buses', youtubeId: yt('vWgswdrGNv4'), short: true,
    about: 'Eight buses to combine channels onto one DAW track, or to feed effects. Patch the bus out where you want it.',
    exercises: [
      { id: 'd', kind: 'desk', task: 'trk-bus', title: 'Two channels onto track bus 1 into DAW 7' }] },
  { id: 'rec-19-exam', title: 'Signal flow exam (formative)', youtubeId: null,
    about: 'The whole session from live room to control room, scored block by block like the real exam: 1 done right, 0.5 partly done, 0 for a fundamental error.',
    exercises: [
      { id: 'exam', kind: 'exam', title: 'Signal flow exam' }] },

  // ---------------- Module 3: microphones (exercises coming) ----------------
  { id: 'rec-20-mics-1', title: 'Get to know your microphones 1', youtubeId: yt('ICNPXxQg8R8'), short: true, exercises: [] },
  { id: 'rec-21-mics-2', title: 'Get to know your microphones 2', youtubeId: yt('A77CBVs-BMQ'), exercises: [] },
  { id: 'rec-22-mics-3', title: 'The classic microphones', youtubeId: yt('jyEOxcnQIi8'), short: true, exercises: [] },
  { id: 'rec-23-polar', title: 'Polar patterns', youtubeId: yt('mQWlWDs1xB8'), exercises: [] },
  { id: 'rec-24-stereo', title: 'Stereo techniques', youtubeId: yt('hGUwGETPpsM'), exercises: [] },
  { id: 'rec-25-drums-12', title: 'Drum mics: set-ups 1 and 2', youtubeId: yt('8fcWrF76Lzc'), exercises: [] },
  { id: 'rec-26-drums-3', title: 'Drum mics: set-up 3', youtubeId: yt('bA9uLt6YeAM'), exercises: [] },

  // ---------------- Module 4: Pro Tools (exercises coming) ----------------
  { id: 'rec-27-pt-basics', title: 'Basic Pro Tools operations', youtubeId: yt('3Uhbk9pwecM'), exercises: [] },
  { id: 'rec-28-guide', title: 'Recording a guide track', youtubeId: yt('My9ESC3yniY'), exercises: [] },
  { id: 'rec-29-edits', title: 'Edits in Pro Tools', youtubeId: yt('VlsrHsxXSH0'), exercises: [] },
  { id: 'rec-30-comping', title: 'Comping drums', youtubeId: yt('pZav4i0Rbf4'), exercises: [] },
  { id: 'rec-31-comping-2', title: 'Drum comping', youtubeId: yt('qs8geIyjiws'), exercises: [] },
  { id: 'rec-32-template', title: 'Pro Tools mix template', youtubeId: yt('HEnGJ4PCYro'), exercises: [] },
  { id: 'rec-33-automation', title: 'Pro Tools automation', youtubeId: yt('YO0LBcWSRWs'), exercises: [] },

  // ---------------- Module 5: mixing on the console (exercises coming) ----------------
  { id: 'rec-34-dyn-eq', title: 'In-console compressors and EQ', youtubeId: yt('iV4s19G1C3w'), exercises: [] },
  { id: 'rec-35-outboard', title: 'External reverb and compressor', youtubeId: yt('RYRstfSd1HA'), exercises: [] },
  { id: 'rec-36-print', title: 'Print the mix', youtubeId: yt('qdtjcm5g8XA'), exercises: [] },
  { id: 'rec-37-print-quick', title: 'Print the mix: quick version', youtubeId: yt('J0eVmGYvDtw'), short: true, exercises: [] },
  { id: 'rec-38-export', title: 'Exporting the stereo mix', youtubeId: yt('TswRsK92Rq4'), short: true, exercises: [] },
  { id: 'rec-39-atmos', title: 'Binaural listening and Dolby Atmos', youtubeId: yt('1a6rh3AO1S8'), exercises: [] },
];

export const findLesson = (id) => LESSONS.find((l) => l.id === id) || null;
export function findExercise(lessonId, exerciseId) {
  const lesson = findLesson(lessonId);
  return { lesson, exercise: lesson ? lesson.exercises.find((e) => e.id === exerciseId) || null : null };
}
export const KIND_LABELS = { quiz: 'Questions', desk: 'On the desk', exam: 'Exam' };
