let bibtex = `@misc{lehman2019surprising,
    title={The Surprising Creativity of Digital Evolution: A Collection of Anecdotes from the Evolutionary Computation and Artificial Life Research Communities}, 
    author={Joel Lehman and Jeff Clune and Dusan Misevic and Christoph Adami and Lee Altenberg and Julie Beaulieu and Peter J. Bentley and Samuel Bernard and Guillaume Beslon and David M. Bryson and Patryk Chrabaszcz and Nick Cheney and Antoine Cully and Stephane Doncieux and Fred C. Dyer and Kai Olav Ellefsen and Robert Feldt and Stephan Fischer and Stephanie Forrest and Antoine Frénoy and Christian Gagné and Leni Le Goff and Laura M. Grabowski and Babak Hodjat and Frank Hutter and Laurent Keller and Carole Knibbe and Peter Krcah and Richard E. Lenski and Hod Lipson and Robert MacCurdy and Carlos Maestre and Risto Miikkulainen and Sara Mitri and David E. Moriarty and Jean-Baptiste Mouret and Anh Nguyen and Charles Ofria and Marc Parizeau and David Parsons and Robert T. Pennock and William F. Punch and Thomas S. Ray and Marc Schoenauer and Eric Shulte and Karl Sims and Kenneth O. Stanley and François Taddei and Danesh Tarapore and Simon Thibault and Westley Weimer and Richard Watson and Jason Yosinski},
    year={2019},
    eprint={1803.03453},
    archivePrefix={arXiv},
    primaryClass={cs.NE}
}`

let bibtex2 = `
@article{Lehman2018TheSC,
    title={The Surprising Creativity of Digital Evolution: A Collection of Anecdotes from the Evolutionary Computation and Artificial Life Research Communities},
    author={Joel Lehman and J. Clune and Dusan Misevic and C. Adami and L. Altenberg and J. Beaulieu and P. Bentley and Samuel Bernard and G. Beslon and David M. Bryson and P. Chrabaszcz and Nick Cheney and Antoine Cully and S. Doncieux and F. Dyer and Kai Olav Ellefsen and R. Feldt and S. Fischer and S. Forrest and Antoine Fr{\'e}noy and Christian Gagn{\'e} and L. K. L. Goff and Laura M. Grabowski and B. Hodjat and F. Hutter and L. Keller and Carole Knibbe and Peter Krcah and R. Lenski and H. Lipson and R. MacCurdy and C. Maestre and R. Miikkulainen and S. Mitri and David E. Moriarty and Jean-Baptiste Mouret and Anh M Nguyen and C. Ofria and M. Parizeau and D. P. Parsons and R. Pennock and W. Punch and Thomas S. Ray and Marc Schoenauer and Eric Shulte and K. Sims and K. Stanley and F. Taddei and Danesh Tarapore and S. Thibault and W. Weimer and R. Watson and Jason Yosinksi},
    journal={Artificial Life},
    year={2018},
    volume={26},
    pages={274-306}
  }
`

function get_book_attribute(string) {
    string = string.trim();
    let split_by_curl = string.split('{')
    split_by_curl = split_by_curl[0];
    return split_by_curl;
}

function get_book_detail(string, book_attribute) {
    book_attribute = book_attribute.concat("{");
    let cleaned_string = string.trim();
    cleaned_string = cleaned_string.replace(book_attribute, "");
    cleaned_string = cleaned_string.slice(0,-1);
    cleaned_string = cleaned_string.trim();
    cleaned_string = cleaned_string.replace("}", "");
    cleaned_string = cleaned_string.replace("{", "");
    return cleaned_string;
}

function get_authors(string, book_attribute) {
    let cleaned_string = get_book_detail(string, book_attribute);
    delimited_arr = cleaned_string.split('and');
    cleaned_arr = [];

    for (let count in delimited_arr) {
        let temp = delimited_arr[count];
        cleaned_arr.push(temp.trim());
    }

    return cleaned_arr;
}

function make_auth_formatted(author_list) {

    let auth_string_list = [];

    // go through all the authors in the delimited main string
    for (let count in author_list) {
        let temp = author_list[count];

        let auth_seg_parts = [];
        let auth = temp.split(' ');

        // go through each author name, and make it into a list of the 
        // different words
        for (let count in auth) {
            let temp = auth[count];
            auth_seg_parts.push(temp);
        }

        auth_string_list.push(auth_seg_parts);
    }

    let author_list_ready = [];

    for (let count in auth_string_list) {
        let author = auth_string_list[count];
        let last_name = author[author.length - 1];
        let initals = [];

        for (let count = 0; count < author.length - 1; count++) {
            let initial = author[count];
            initals.push(initial.charAt(0));
        }

        author_list_ready.push({
            "last_name": last_name,
            "initials": initals
        });
    }


    return author_list_ready;

}

function get_date() {
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    return `${cDay}-${cMonth}-${cYear}`
}

function convert_to_uweharvard_from_bibtext(raw_string) {
    let title = "";
    let authors = []; // after getting the names, we will have to get the last name, and initialize the first name parts, and then make it nice...
    let journal_name = "";
    let year = "";
    let volume = "";
    let pages = "";
    let accessed_date = get_date();
    let others = [];

    let split_string = raw_string.split(',');
    // console.log(split_string);

    for (let i = 0; i < split_string.length; i++) {
        let s_string = split_string[i];
        let paper_attribute = get_book_attribute(s_string);

        switch (paper_attribute) {
            case "title=":
                title = get_book_detail(s_string, paper_attribute);
                break;
            case "author=":
                let = authors_temp = get_authors(s_string, paper_attribute);
                authors = make_auth_formatted(authors_temp);
                break;
            case "journal=":
                journal_name = get_book_detail(s_string, paper_attribute);
                break;
            case "year=":
                year = get_book_detail(s_string, paper_attribute);
                break;
            case "volume=":
                volume = get_book_detail(s_string, paper_attribute);
                break;
            case "pages=":
                pages = get_book_detail(s_string, paper_attribute);
                break;
            default:
                others.push({
                    "attribute": paper_attribute,
                    "string": s_string
                })
        }
    }

    let formated_string = "";

    let counter = 0; // cant use the authors array in the 2nd loop for some reason
    for (let count = 0; count < authors.length - 1; count++) {

        let last_name = authors[count]["last_name"];
        formated_string = formated_string.concat(` ${last_name}, `);

        let initial_list = authors[count]["initials"];
        for (let i = 0; i < initial_list.length; i++) {
            let initial_name = initial_list[i];
            formated_string = formated_string.concat(`${initial_name}.`);
        }

        formated_string = formated_string.concat(`,`);
        counter++;
    }

    // when control comes here, last to 2 name will not be there. Add last one manually, 
    // then delete the last character, which is a comma
    formated_string = formated_string.slice(0, formated_string.length - 1);
    formated_string = formated_string.concat(` and `);

    let last_name_ = authors[counter]["last_name"];
    formated_string = formated_string.concat(`${last_name_}, `);

    let initials_ = authors[counter]["initials"];
    for (let j = 0; j < initials_.length; j++) {
        formated_string = formated_string.concat(`${initials_[j]}`);
    }
    formated_string = formated_string.concat(`.`);

    final_string = "";
    final_string = final_string.concat(`${formated_string} (${year}) ${title}`);

    if (journal_name !== "") {
        final_string = final_string.concat(`. <i>${journal_name}</i> `)
    }

    final_string = final_string.concat(`.[online].[${accessed_date}].`);


    return final_string;

}

// console.log(convert_to_uweharvard_from_bibtext(bibtex));
// console.log("---------");
// console.log(convert_to_uweharvard_from_bibtext(bibtex2));

