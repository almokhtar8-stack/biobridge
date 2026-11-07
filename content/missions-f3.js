/* Foundation 3 terminal missions. Written to tools/CONTENT_GUIDE.md (section 7). */
window.BB = window.BB || {};
BB.missions = BB.missions || {};

BB.missions['f3-fasta'] = {
  title: 'Explore a FASTA file',
  start: '/home/student/project/data',
  intro: 'The file `sequences.fa` holds six toy DNA sequences. Use commands from Foundation 1 to look inside it, count its records and search it, the way you would check any FASTA file before using it.',
  steps: [
    {
      goal: 'Show the first four lines of `sequences.fa`.',
      hint: 'head -n NUMBER FILE',
      solution: 'head -n 4 sequences.fa',
      check: { cmd: 'head', outputIncludes: '>seq_02 toy sequence B' },
      explain: 'Line 1 is the header of seq_01. Lines 2 and 3 are both its sequence, because the file wraps long sequences at 60 letters. Line 4 starts with `>`, so a new record, seq_02, begins there.'
    },
    {
      goal: 'Count the lines in the file.',
      hint: 'wc -l FILE',
      solution: 'wc -l sequences.fa',
      check: { cmd: 'wc', outputIncludes: '15' },
      explain: 'The file has 15 lines, but that is not the number of sequences: it is 6 header lines plus 9 sequence lines, because three records are wrapped onto two lines each.'
    },
    {
      goal: 'Count the sequences by counting the header lines, the lines that contain `>`.',
      hint: 'grep -c ">" FILE   (keep the quotes around >)',
      solution: 'grep -c ">" sequences.fa',
      check: { cmd: 'grep', outputEquals: '6' },
      explain: 'Each record has exactly one header line, so counting the lines that contain `>` gives 6 sequences. The quotes matter: an unquoted > tells the shell to send the output into a file, which would replace sequences.fa.'
    },
    {
      goal: 'Print only the header lines, to see the name of each sequence.',
      hint: 'grep "PATTERN" FILE',
      solution: 'grep ">" sequences.fa',
      check: { cmd: 'grep', outputIncludes: '>seq_06 toy sequence F' },
      explain: 'The identifier is the first word after `>` (seq_01 to seq_06); the rest of each header is a description. Other tools use these identifiers to refer to each sequence.'
    },
    {
      goal: 'Find the lines that contain the sequence GAATTC, and show their line numbers.',
      hint: 'grep -n PATTERN FILE',
      solution: 'grep -n GAATTC sequences.fa',
      check: { cmd: 'grep', outputIncludes: '10:ATGGAATTC' },
      explain: 'GAATTC is the site cut by the restriction enzyme EcoRI. It is on line 2, inside seq_01, and on line 10, inside seq_04 (the nearest header above each line names the record). grep searches one line at a time, so a site split across a line break would be missed; sequence tools join the lines of each record before searching.'
    }
  ],
  done: 'You checked a FASTA file the way bioinformaticians do on a server: look at the top, count records by their headers and search for a motif. A human reference genome FASTA uses the same format and is about 3 GB, so commands like these are a quick first check before any analysis.'
};
