## return line 
    find      : xxx
    replace : \nxxx

## '11-04-2010', needs to become '2010-04-11', in every row.
    Find:  ([0-9]+)-+([0-9]+)-+([0-9]+) 
    Replace: \3-\2-\1

## replace timestamps to blank
    2012-06-26 21:31:40 Killshot: 
    \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}

## replace lowercase to upercase
    example: test this sentence

    Find: \([^ ]*\) \(.*\) 
    Replace: \U\1\E \2

    the \U will cause all following chars to be upper
    the \E will turn off the \U

    the result will be: TEST this sentence

## Delete all lines starting with # or ; in Notepad++
    Find: ^[#;].*
    Replace: [leave it blank]