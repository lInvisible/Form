function FormChecker(sSelector){

	let elem       = document.getElementById(sSelector)
	,textfields    = document.querySelectorAll(".textfield") 
        ,errorMessage  = document.getElementsByClassName("form__message_error")
        ,clear         = document.getElementsByClassName("clear")
        ,date          = document.getElementsByName("date")[0]
        ,email         = document.getElementsByName("email")[0]
        ,about         = document.getElementsByTagName("textarea")[0]
        ,grade         = document.getElementsByTagName("output")[0]
        ,country       = document.getElementsByTagName("select")[0]
        ,gender        = document.getElementsByName("gender")[0]
        ,male          = document.getElementsByClassName("male")[0]
        ,female        = document.getElementsByClassName("female")[0];

        function checkTextField (event, textfield){
            let currentTextfield = textfield ? textfield : event.currentTarget
            ,regExp              = new RegExp("[A-ZА-Я][a-zа-я\\-` ]{2,18}$");
            if (currentTextfield === document.getElementsByName("street")[0]){
                regExp = new RegExp("^[A-ZА-Я][a-zа-я\\-` ]{2,18}[0-9(,\\/ 0-9)?]{1,8}$");
            }
            let isTextfieldError = ! currentTextfield.value.match(regExp);
            currentTextfield.classList.toggle("textfield_error", isTextfieldError);
            return isTextfieldError;
        }

        function checkTextfieldsGroup(event){
            event.preventDefault();
            let isFormError = false;
            for (let i = 0; i < textfields.length; i++) {
                let isTextfieldError 	= checkTextField(null, textfields[i]);
                if(isTextfieldError){
                    isFormError = true;
                }
            }
            isFormError ? errorMessage[0].style.display = "block" : errorMessage[0].style.display = "none";
            return isFormError;
        }

        function findChecked(){
            let chb = document.getElementsByClassName("course")
            ,checked = []
            ,course = "";
            for (let i = 0; i < chb.length; i++){
                if (chb[i].checked){
                    course = chb[i].getAttribute("name");
                    checked.push(course);
                }
            }
            return checked;
        }

        function clearValues(){
            for (let i = 0; i < textfields.length; i++) {
                textfields[i].value = "";
            }
            date.value = email.value = about.value = country.value = "";
            let chb = findChecked();
            for (let i=0; i< chb.length; i++){
                document.getElementsByName(chb[i])[0].checked = false;
            }
            grade.value = document.getElementsByName("grade")[0].value = 1;
            male.checked = female.checked = false;
        }

        function loadState(){
            try {
                const serState = localStorage.getItem('state');
                if (serState){
                  return JSON.parse(serState);
                }
                return null;
            } 
            catch (err) { 
                console.log(err);
                return null; 
            }  
        }

        function loadValues(){
            const values = loadState();
            for (key in values) {
                if (key === "gender"){
                    document.getElementsByClassName(values[key])[0].checked = true;
                }else if (key === "courses"){
                    let namesArr = values[key];
                    for (let i = 0; i < namesArr.length; i++){
                        document.getElementsByName(namesArr[i])[0].checked = true;
                    }
                }else if (key === "grade"){
                    grade.innerText = values[key];
                    document.getElementsByName(key)[0].value = values[key];
                }else{
                    document.getElementsByName(key)[0].value = values[key];
                }
            };
        }

        function endWork(){
            document.getElementsByClassName("container")[0].style.display = "none";
            document.getElementsByClassName("done")[0].style.display = "block";
        }

        function saveAndPost(event){
            if (!checkTextfieldsGroup(event)){
                let info = {"name"     : textfields[0].value
                            ,"lname"   : textfields[1].value
                            ,"date"    : date.value
                            ,"gender"  : (male.checked) ? male.value : female.value
                            ,"city"    : textfields[2].value
                            ,"street"  : textfields[3].value
                            ,"email"   : email.value
                            ,"about"   : about.value
                            ,"country" : country.value
                            ,"courses" : findChecked()
                            ,"grade"   : grade.value
                           }
                localStorage.setItem('state', JSON.stringify(info));

                fetch(`https://jsonplaceholder.typicode.com/users`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify(info)
                })
                endWork();
            }
            
        }

        for (let i = 0; i < textfields.length; i++) {
            textfields[i].addEventListener("blur", checkTextField);
            textfields[i].addEventListener("focus", function() {clear[i].style.display = "block";});
            clear[i].addEventListener("click", function() {textfields[i].value = "";clear[i].style.display = "none";});
        }
        document.getElementsByClassName("button")[0].addEventListener("click", clearValues);
        elem.addEventListener("submit", checkTextfieldsGroup);
        elem.addEventListener("submit", saveAndPost);
        window.addEventListener("load", loadValues);

}
