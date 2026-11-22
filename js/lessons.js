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

  // ---------------- Module 3: microphones ----------------
  { id: 'rec-11-mics', title: 'Know your microphones',
    about: 'The mic locker: the Neumann U87 and U67, the AKG 414, C451 and D112, the Electro-Voice RE20, a ribbon, the tom and amp mic and the SM57. Which ones need phantom power, which are delicate, and what each is good at.',
    videos: [V('ICNPXxQg8R8', 'Get to know your microphones, part 1', true), V('A77CBVs-BMQ', 'Get to know your microphones, part 2'), V('jyEOxcnQIi8', 'The classic microphones', true)],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'The mic locker', questions: [
        { q: 'Which patterns can you select on the Neumann U87?', a: ['Cardioid only', 'Omni, cardioid and figure of eight', 'Cardioid and hypercardioid'], ok: 1, v: 0, at: 0 },
        { q: 'The AKG 414 is a condenser. What does it need from the desk?', a: ['Nothing', 'Phantom power (48V)', 'A DI box'], ok: 1, v: 1, at: 24 },
        { q: 'Which is a large-diaphragm dynamic, needs no phantom power and is built to keep proximity effect down?', a: ['AKG C451', 'Electro-Voice RE20', 'Neumann U87'], ok: 1, v: 1, at: 91 },
        { q: 'Which mic is designed for the kick drum and the bass amp?', a: ['AKG D112', 'AKG C451', 'Neumann U67'], ok: 0, v: 1, at: 134 },
        { q: 'The ribbon mic in the locker…', a: ['Needs 48V to work', 'Is passive and delicate: no phantom power, and a wrong procedure can break the ribbon at once', 'Is the toughest mic we have'], ok: 1, v: 1, at: 201 },
        { q: 'The mic you find on toms and amps has a switch next to its XLR connector. What does it set?', a: ['The polar pattern', 'A bass roll-off, from Music to Speech', 'A 10 dB pad'], ok: 1, v: 1, at: 245 },
        { q: 'Why is the SM57 so useful on stage?', a: ['Its even cardioid rejects sound from the back, which keeps feedback down', 'It is the brightest mic there is', 'It needs no cable'], ok: 0, v: 1, at: 295 },
        { q: 'The U67\'s pad and 40 Hz high-pass filter help when…', a: ['You need phantom power', 'You are close up: they overcome overload and proximity effect', 'You record in stereo'], ok: 1, v: 2, at: 0 },
      ] }] },
  { id: 'rec-12-polar', title: 'Polar patterns',
    about: 'Frequency response, off-axis colour, self noise, and the four typical patterns: omni, figure of eight, cardioid and hypercardioid.',
    videos: [V('mQWlWDs1xB8', 'Microphone polar patterns')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Patterns', questions: [
        { q: 'When people say a mic is flat, they mean…', a: ['It has no proximity effect', 'It does not colour any frequency: a flat frequency response', 'It is a dynamic mic'], ok: 1, at: 0 },
        { q: 'Someone sings into the back of a cardioid. What do you get?', a: ['The same sound, a little quieter', 'Off-axis sound: quieter and coloured. Useful only on purpose, like a voice behind a door', 'Nothing changes: cardioids hear all round'], ok: 1, at: 32 },
        { q: 'Which mics are most prone to self noise, and why?', a: ['Dynamics, because of the magnet', 'Condensers, because their built-in preamp amplifies the tiny signal from the capsule', 'Ribbons, because of phantom power'], ok: 1, at: 54 },
        { q: 'What mostly decides a mic\'s polar pattern?', a: ['The type of transducer', 'The casing and ports around the capsule', 'The cable'], ok: 1, at: 87 },
        { q: 'Is a mic\'s pattern the same at every frequency?', a: ['Yes, always', 'No: often very directional at high frequencies and nearly omni at low ones'], ok: 1, at: 106 },
        { q: 'A figure of eight picks up…', a: ['Equally all round', 'Front and back almost equally, nearly nothing at the sides', 'Only at the front'], ok: 1, at: 142 },
        { q: 'Compared with a cardioid, a hypercardioid…', a: ['Is more directional: even less pickup at the sides and back', 'Picks up more from the sides', 'Is the same as an omni'], ok: 0, at: 182 },
      ] }] },
  { id: 'rec-13-stereo', title: 'Stereo techniques',
    about: 'Coincident pairs (XY, MS, Blumlein), spaced pairs (AB), near-coincident pairs and the baffled omni pair. Then build them in the stereo pair simulator: the stereo recording angle (SRA) of each pair, after Michael Williams, and where each player lands between the speakers.',
    videos: [V('hGUwGETPpsM', 'Stereo techniques')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Stereo pairs', questions: [
        { q: 'What does stereo miking give you that mono does not?', a: ['Only more level', 'A left-to-right image, depth between instruments, distance and the room\'s ambience'], ok: 1, at: 0 },
        { q: 'XY: how are the two capsules placed?', a: ['As close as possible, at 90° to each other', 'A metre apart and parallel', 'Back to back'], ok: 0, at: 64 },
        { q: 'On a spaced pair (AB), more distance between the mics gives…', a: ['A narrower image', 'A wider image and more sense of space, until it gets exaggerated'], ok: 1, at: 174 },
        { q: 'A baffled omni pair needs…', a: ['Two cardioids', 'Two omnis with a baffle between them', 'Two figure of eights'], ok: 1, at: 195 },
        { q: 'A Blumlein pair is…', a: ['Two cardioids at 90°', 'Two figure-of-eight mics, coincident, at 90°', 'Two spaced omnis'], ok: 1, at: 232 },
        { q: 'Why is Blumlein good for a choir standing around the mics?', a: ['It picks up the front and the back', 'It rejects the room completely'], ok: 0, at: 298 },
      ] },
      { id: 'xy', kind: 'desk', sim: 'stereo', task: 'xy', title: 'Build an XY pair', at: 64 },
      { id: 'ortf', kind: 'desk', sim: 'stereo', task: 'ortf', title: 'Build an ORTF pair' },
      { id: 'blumlein', kind: 'desk', sim: 'stereo', task: 'blumlein', title: 'Build a Blumlein pair for the choir', at: 232 },
      { id: 'ab', kind: 'desk', sim: 'stereo', task: 'ab', title: 'Space two omnis for the choir', at: 174 },
      { id: 'quartet', kind: 'desk', sim: 'stereo', task: 'quartet', title: 'Fit the quartet between the speakers' },
      { id: 'zoom', kind: 'desk', sim: 'stereo', task: 'zoom', title: 'The stereophonic zoom' }] },
  { id: 'rec-14-drums', title: 'Drum mic set-ups',
    about: 'Set-up 1: one mic in the room to hear the kit\'s balance. Set-up 2: one mic at the top of an equilateral triangle. Set-up 3: the Glyn Johns three-mic set-up. And the order to build it all in.',
    videos: [V('8fcWrF76Lzc', 'Drum set-ups 1 and 2'), V('bA9uLt6YeAM', 'Drum set-up 3')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Drum set-ups', questions: [
        { q: 'Set-up 1: where does the single mic go?', a: ['On the snare', 'At about the drummer\'s head height, about 2 m (8 ft) away, facing the middle of the kit', 'Inside the kick'], ok: 1, v: 0, at: 0 },
        { q: 'What is set-up 1 for?', a: ['The final drum sound', 'Hearing the kit\'s overall balance in the room, so the drummer can fix the tuning and balance first'], ok: 1, v: 0, at: 25 },
        { q: 'In what order do you build a set-up?', a: ['Mics, then stands, then cables', 'Stands where they go, then mounts and mics secured, cables laid, and only then plug into the tie box', 'Cables into the tie box first'], ok: 1, v: 0, at: 70 },
        { q: 'Set-up 2: where is the mic?', a: ['At the top of an equilateral triangle built on the length of the carpet: above the drummer, not over their head, pointing at the snare', 'On the floor in front of the kick', 'Behind the drummer at knee height'], ok: 0, v: 0, at: 116 },
        { q: 'With one mic on the kit you want more kick. What do you do?', a: ['Raise the mic', 'Lower the mic', 'Switch it to omni'], ok: 1, v: 1, at: 47 },
        { q: 'Set-up 3 (Glyn Johns) uses…', a: ['Two identical mics, one each side of the kit, plus a kick mic', 'One overhead only', 'A close mic on every drum'], ok: 0, v: 1, at: 70 },
        { q: 'Why is a U67 with a U87 not ideal for the Glyn Johns set-up?', a: ['They need different phantom power', 'It is designed around two identical mics'], ok: 1, v: 1, at: 91 },
        { q: 'A mic stand touches the drum kit. Is that OK?', a: ['Yes', 'No: you will get noise. No part of a stand may touch the kit'], ok: 1, v: 1, at: 131 },
      ] }] },

  // ---------------- Module 4: Pro Tools ----------------
  { id: 'rec-15-pt-basics', title: 'Pro Tools basics',
    about: 'Selecting tracks fast, the modifier keys (Option, Option-Shift, Command-Option-Shift), bars and beats, grid and slip, and memory locations as markers and as saved views.',
    videos: [V('3Uhbk9pwecM', 'Basic Pro Tools operations')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Basic operations', questions: [
        { q: 'What does pressing E do while you edit?', a: ['Opens the Edit window', 'Makes the selected track bigger, without choosing large or jumbo by hand', 'Exports the session'], ok: 1, at: 62 },
        { q: 'Option-click on a track\'s control (track height, output…) applies it to…', a: ['All the tracks in the session', 'Only the selected tracks', 'That track only'], ok: 0, at: 83 },
        { q: 'Option-Shift-click applies it to…', a: ['All the tracks', 'All the selected tracks', 'Nothing: it undoes'], ok: 1, at: 83 },
        { q: 'You hold Command-Option-Shift and set track 1\'s output to 1. What do the others get?', a: ['Output 1 as well', 'Cascading: 2, 3, 4… in order', 'No output'], ok: 1, at: 107 },
        { q: 'Before the session starts, the main counter should show…', a: ['Minutes and seconds', 'Bars and beats, with the right tempo and time signature set', 'Timecode'], ok: 1, at: 144 },
        { q: 'Clips do not snap to the grid. Why?', a: ['The grid is too small', 'You are in slip mode: snapping needs grid mode', 'The track is muted'], ok: 1, at: 216 },
        { q: 'Which edit modes are better left alone for now?', a: ['Grid and slip', 'Shuffle and spot'], ok: 1, at: 228 },
        { q: 'The quickest way to make a new memory location is…', a: ['Enter on the numeric keypad', 'Command-S', 'Double-clicking the track'], ok: 0, at: 235 },
        { q: 'A memory location saved as a selection with the zoom and track heights ticked lets you…', a: ['Record a new take', 'Jump back to a saved view, for example just the bass, zoomed the way you like it'], ok: 1, at: 288 },
      ] }] },
  { id: 'rec-16-guide', title: 'Recording a guide track',
    about: 'A new 48 kHz session, the Edit and Mix windows, the playback engine and buffer, a clean I/O set-up, a click with count-off, and recording takes on playlists.',
    videos: [V('My9ESC3yniY', 'Recording a guide track in Pro Tools')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Guide track', questions: [
        { q: 'How do you swap between the Edit and Mix windows?', a: ['Command =', 'Command E', 'Option M'], ok: 0, at: 44 },
        { q: 'How do you get the trim, selector and grabber all at once?', a: ['Press T', 'Click the bar above the three tools (the multi-tool)', 'Hold Option'], ok: 1, at: 87 },
        { q: 'What buffer size do you choose for recording?', a: ['1024 or more', '256 or 512, never more than 512, to keep latency low', 'It makes no difference'], ok: 1, at: 194 },
        { q: 'In the I/O set-up, what do you check first?', a: ['That the Dolby Atmos renderer is unticked, so it does not take over the outputs', 'That the buffer is at 1024', 'That the click is on'], ok: 0, at: 217 },
        { q: 'With zoom on, which keys zoom out and in?', a: ['R out, T in', 'T out, R in', 'Z and X'], ok: 0, at: 358 },
        { q: 'Why record the takes on playlists instead of on the main track?', a: ['They sound better', 'The main track is the final result: you record each take on a new playlist and comp the best bits up', 'Pro Tools cannot record on the main track'], ok: 1, at: 490 },
        { q: 'The shortcut for a new playlist is…', a: ['Control-/ (forward slash)', 'Command-N', 'Option-P'], ok: 0, at: 539 },
        { q: 'Guitar and vocal were recorded together and are grouped. Why promote the same take on both?', a: ['To save disk space', 'So the vocal still matches the guitar: they are one performance'], ok: 1, at: 678 },
        { q: 'You drag an audio file into the track list instead of onto a track. What happens?', a: ['Nothing', 'Pro Tools makes a new track for it'], ok: 1, at: 809 },
      ] }] },
  { id: 'rec-17-edits', title: 'Editing in Pro Tools',
    about: 'Playlists view, promoting the best parts, slip mode for precise trims, the multi-tool, and fades on every cut so nothing clicks.',
    videos: [V('VlsrHsxXSH0', 'Edits in Pro Tools')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Edits', questions: [
        { q: 'Where do you find the takes you recorded?', a: ['In the Mix window', 'Track view menu: waveform → playlists', 'In the clip list only'], ok: 1, at: 43 },
        { q: 'You like a part of take 2. How does it get onto the comp track?', a: ['Copy and paste it', 'Select it and press the promote arrow', 'Drag it to the top'], ok: 1, at: 84 },
        { q: 'You trim to the very start of a word. Which mode?', a: ['Grid', 'Slip', 'Shuffle'], ok: 1, at: 131 },
        { q: 'What does the Escape key do to the tools?', a: ['Deselects everything', 'Cycles through them', 'Closes the session'], ok: 1, at: 156 },
        { q: 'Select clips and press F. What do you get, and how long by default?', a: ['A freeze, 1 second', 'Fades on every cut, 10 ms by default', 'A new playlist'], ok: 1, at: 200 },
        { q: 'Why does every cut need a fade?', a: ['It looks tidier', 'Without one you hear a click on good studio speakers', 'Pro Tools will not play the clip'], ok: 1, at: 277 },
      ] }] },
  { id: 'rec-18-comping', title: 'Comping drums',
    about: 'Group the drum mics (mix and edit), find the best performance on the playlists, promote it, fix the joins with crossfades in slip mode, fade and consolidate.',
    videos: [V('qs8geIyjiws', 'Drum comping'), V('pZav4i0Rbf4', 'Comping drums in depth')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Comping', questions: [
        { q: 'Why can you not edit each drum mic on its own?', a: ['It takes too long', 'Every mic picks up the whole kit: moving one track against the others causes phase problems', 'Pro Tools will not allow it'], ok: 1, v: 0, at: 23 },
        { q: 'Which type of group do you make for the drums (Command-G)?', a: ['Mix only', 'Edit only', 'Mix and edit'], ok: 2, v: 0, at: 49 },
        { q: 'The drummer pushes ahead of the click for a musical fill, then comes back on time. You…', a: ['Cut it onto the grid', 'Use your judgement and keep the musicality', 'Delete the fill'], ok: 1, v: 0, at: 170 },
        { q: 'An edit point cuts through a crash cymbal\'s tail. What do you do?', a: ['Leave it', 'Move the edit point, on all grouped tracks, to a gap where nothing rings', 'Turn the overheads down'], ok: 1, v: 0, at: 254 },
        { q: 'The comp is done and faded. The last step is…', a: ['Edit → Consolidate clip (Option-Shift-3)', 'Delete the playlists', 'Bounce to disk'], ok: 0, v: 0, at: 337 },
        { q: 'You selected the best take on a playlist. How do you move it to the main track?', a: ['Drag it up', 'Click the promote arrow: dragging would take it out of the playlist', 'Copy it to a new track'], ok: 1, v: 1, at: 454 },
        { q: 'You swapped in a better part from another take. How do you fix the join?', a: ['In grid mode with a fade-in', 'In slip mode, with a crossfade between the two clips', 'You cannot'], ok: 1, v: 1, at: 725 },
        { q: 'The outputs are set but you hear nothing. What is often missing?', a: ['The click', 'The digital bus that connects Pro Tools to the speaker output', 'A playlist'], ok: 1, v: 1, at: 899 },
      ] }] },
  { id: 'rec-19-template', title: 'Mix template and automation',
    about: 'A Dolby Atmos mix template (48 kHz, a 7.1.4 mix bus and master), then automation: the automation window, read, touch, latch and write, and preview with punch.',
    videos: [V('HEnGJ4PCYro', 'Pro Tools mix template'), V('YO0LBcWSRWs', 'Pro Tools automation')],
    exercises: [
      { id: 'q', kind: 'quiz', title: 'Template and automation', questions: [
        { q: 'A mix template for Dolby Atmos runs at…', a: ['44.1 kHz, 16 bit', '48 kHz, with the highest bit depth you can', '96 kHz, 16 bit'], ok: 1, v: 0, at: 0 },
        { q: 'For an Atmos mix, the mix bus is…', a: ['A stereo aux', 'A 7.1.4 aux input fed by a 7.1.4 bus', 'A mono audio track'], ok: 1, v: 0, at: 66 },
        { q: 'You set all the audio tracks\' outputs to the mix bus but not the aux itself. How?', a: ['Option-click', 'Select them and Option-Shift-click', 'Command-Option-Shift-click'], ok: 1, v: 0, at: 259 },
        { q: 'Why add a 7.1.4 master fader?', a: ['To record on it', 'To control and meter what goes into the Dolby mix bus', 'For the click'], ok: 1, v: 0, at: 350 },
        { q: 'Only volume is enabled in the automation window. You move the pan on a latched track. What is recorded?', a: ['The pan', 'Nothing: disabled parameters are protected from accidental changes', 'Both'], ok: 1, v: 1, at: 36 },
        { q: 'You want the guitar up for a few bars, then back where it was. Which mode?', a: ['Touch: when you let go it returns to the level before', 'Latch', 'Read'], ok: 0, v: 1, at: 94 },
        { q: 'You want the guitar to stay at a new level from bar 39. Which mode?', a: ['Touch', 'Latch: it stays at the value where you let go', 'Read'], ok: 1, v: 1, at: 172 },
        { q: 'Why is write mode dangerous?', a: ['It is slow', 'Every track left in write writes on every pass and can wipe hours of work', 'It mutes the track'], ok: 1, v: 1, at: 209 },
        { q: 'Preview a value, select the area and punch it in. How do you avoid waiting for a whole pass?', a: ['Press stop at once', 'Use write on stop to the next breakpoint', 'Turn automation off'], ok: 1, v: 1, at: 393 },
      ] }] },

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
  { id: 'rec-25-zen', title: 'The challenge of Maestro Zen', videos: [], requires: 'rec-24-final', zen: true,
    about: 'Three gates on the desk, no hints, no checklist. Maestro Zen is calm, and he forgives nothing: one fault (phantom power, feedback, a clipping preamp, the click in the mix) and the gate closes. Pass all three for 100 XP: you are a Zen Recording Master.',
    exercises: [
      { id: 'zen1', kind: 'desk', task: 'zen1', title: 'Gate 1 · The silent take' },
      { id: 'zen2', kind: 'desk', task: 'zen2', title: 'Gate 2 · The singer\'s ears', after: 'zen1' },
      { id: 'zen3', kind: 'desk', task: 'zen3', title: 'Gate 3 · One take', after: 'zen2' }] },
];

export const findLesson = (id) => LESSONS.find((l) => l.id === id) || null;
export function findExercise(lessonId, exerciseId) {
  const lesson = findLesson(lessonId);
  return { lesson, exercise: lesson ? lesson.exercises.find((e) => e.id === exerciseId) || null : null };
}
export const KIND_LABELS = { quiz: 'Questions', desk: 'On the desk', exam: 'Exam' };
