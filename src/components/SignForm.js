import './SignForm.scss';
export default class SignForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'sms-sign-up';
    }

    buildForm(_panel){
        console.log(_panel);
        // Create phone input
        let input = document.createElement('input');
        input.type = 'phone';
        input.placeholder = 'Enter phone - numbers only.';
        input.setAttribute('id', 'phone');
        input.setAttribute('required', true);
        input.addEventListener('keyup', (ev)=>{
            _panel.signup.phoneFormat(ev, _panel.signup);
        });
        let inputLabel = document.createElement('label');
        inputLabel.innerText = "Phone";
        inputLabel.setAttribute("for", "phone"); 
        let inputContainer = document.createElement('div');
        inputContainer.className = "container-box";
        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(input);
        // Create service selection
        let checkBoxTrash = document.createElement('input');
        checkBoxTrash.type = 'checkbox';
        checkBoxTrash.setAttribute('id', 'trash');
        checkBoxTrash.value = _panel.data.next_pickups.trash.route;
        checkBoxTrash.name = "service-signup";
        checkBoxTrash.setAttribute('checked', true);
        let checkBoxTrashLabel = document.createElement('label');
        checkBoxTrashLabel.innerText = "Garbage";
        checkBoxTrashLabel.setAttribute("for", "trash");
        let checkboxContainerTrash = document.createElement('div');
        checkboxContainerTrash.className = "checkbox-container-box";
        checkboxContainerTrash.appendChild(checkBoxTrash);
        checkboxContainerTrash.appendChild(checkBoxTrashLabel); 

        let checkBoxRecycle = document.createElement('input');
        checkBoxRecycle.type = 'checkbox';
        checkBoxRecycle.setAttribute('id', 'recycling');
        checkBoxRecycle.value = _panel.data.next_pickups.recycling.route;
        checkBoxRecycle.name = "service-signup";
        checkBoxRecycle.setAttribute('checked', true);
        let checkBoxRecycleLabel = document.createElement('label');
        checkBoxRecycleLabel.innerText = "Recycle";
        checkBoxRecycleLabel.setAttribute("for", "recycling");
        let checkboxContainerRecycle = document.createElement('div');
        checkboxContainerRecycle.className = "checkbox-container-box";
        checkboxContainerRecycle.appendChild(checkBoxRecycle);
        checkboxContainerRecycle.appendChild(checkBoxRecycleLabel); 

        let checkBoxBulk = document.createElement('input');
        checkBoxBulk.type = 'checkbox';
        checkBoxBulk.setAttribute('id', 'bulk');
        checkBoxBulk.value = _panel.data.next_pickups.bulk.route;
        checkBoxBulk.name = "service-signup";
        checkBoxBulk.setAttribute('checked', true);
        let checkBoxBulkLabel = document.createElement('label');
        checkBoxBulkLabel.innerText = "Bulk/Yard Waste";
        checkBoxBulkLabel.setAttribute("for", "bulk");
        let checkboxContainerBulk = document.createElement('div');
        checkboxContainerBulk.className = "checkbox-container-box";
        checkboxContainerBulk.appendChild(checkBoxBulk);
        checkboxContainerBulk.appendChild(checkBoxBulkLabel); 

        let checkboxContainers = document.createElement('div');
        checkboxContainers.className = "checkbox-container-group-box";
        checkboxContainers.appendChild(checkboxContainerTrash);
        checkboxContainers.appendChild(checkboxContainerRecycle);
        checkboxContainers.appendChild(checkboxContainerBulk);
        // Create message section
        let alertMessage = document.createElement('div');
        alertMessage.className = "alert-message-box";
        // Create submit button
        let signupButton = document.createElement('button');
        signupButton.innerText = "SIGN ME UP FOR REMINDERS";
        // Load form with components
        _panel.signup.form = document.createElement('form');
        _panel.signup.form.appendChild(checkboxContainers);
        _panel.signup.form.appendChild(inputContainer);
        _panel.signup.form.appendChild(alertMessage);
        _panel.signup.form.appendChild(signupButton);
        _panel.signup.form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            _panel.signup.validatePhone(ev, _panel);
        });
    }

    phoneFormat(ev){
        let numbers = ev.target.value.replace(/\D/g, ''),
        char = {0:'(',3:')',6:'-'};
        ev.target.value = '';
        for (var i = 0; i < numbers.length; i++) {
            ev.target.value += (char[i]||'') + numbers[i];
        }
    }

    signUpUser(url, data, success){
        console.log(_panel);
        let params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }
            ).join('&');
        // console.log(params);
        let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onload  = function() {
          if (xhr.readyState>3 && Math.trunc(xhr.status / 100) == 2) {
            success(xhr.responseText);
          }else{
            document.querySelector('.invalid-phone-error-message').innerHTML = 'There was an error with your request. Please try again.';
            document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
          }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.addEventListener("error", function(e){
          console.log(e);
        });
        xhr.send(params);
        return xhr;
    }
    
    stripPhoneNumber(number){
        let newNumber = '';
        newNumber = number.split('(')[1];
        try {
            newNumber = newNumber.split(')')[0] + newNumber.split(')')[1];
        } catch (error) {
            return null;
        }
        try {
            newNumber = newNumber.split('-')[0] + newNumber.split('-')[1];
        } catch (error) {
            return null;
        }
        return newNumber;
    }

    closeSection(ev){
        let tempClass = ev.target.parentNode.className;
        tempClass = tempClass.split(' ');
        ev.target.parentNode.className = tempClass[0];
    }
     
    validatePhone(ev, _panel){
        console.log(ev);
        let phoneNumber = ev.target[0].value;
        let a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phoneNumber);
        phoneNumber = this.stripPhoneNumber(phoneNumber);
        if(phoneNumber == null){
            console.log(ev.target.childNodes[2]);
            let closeBtn = document.createElement('button');
            closeBtn.innerText = 'x';
            closeBtn.className = 'close-section-btn';
            closeBtn.addEventListener("click", function(e){
                e.preventDefault();
                _panel.signup.closeSection(e);
            });
            let msg = document.createElement('p');
            msg.innerText = 'Invalid phone number. Please enter a valid number.';
            ev.target.childNodes[2].appendChild(closeBtn);
            ev.target.childNodes[2].appendChild(msg);
            ev.target.childNodes[2].className = 'alert-message-box active error';
        }else{
            if(a){
                let routeIDs = '';
                let servicesSignup = '';
                let serviceCheckList = document.querySelectorAll('.service-check > input[type="checkbox"]');
                for (var i = 0; i < serviceCheckList.length; i++) {
                  if(serviceCheckList[i].checked){
                    routeIDs += serviceCheckList[i].value + ',';
                    servicesSignup += serviceCheckList[i].name + ',';
                  }
                }
                if(routeIDs !== ''){
                  let data = {
                    'phone_number'  : phoneNumber,
                    'waste_area_ids': routeIDs,
                    'service_type'  : servicesSignup,
                    'address' : document.querySelector('.street-name').innerHTML,
                    'latitude' :  document.querySelector('.info-container > input[name="lat"]').value,
                    'longitude' : document.querySelector('.info-container > input[name="lng"]').value
                  };
                  sendSignUpRequest('https://apis.detroitmi.gov/waste_notifier/subscribe/', data, function(response){
                      document.querySelector('.phone-valid-alert').className = 'phone-valid-alert active';
                  });
                }else{
                  document.querySelector('.invalid-phone-error-message').innerHTML = 'Plese select one or more services to recive reminders.';
                  document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
                }
              }else{
                document.querySelector('.invalid-phone-error-message').innerHTML = 'Invalid number. Please enter re-enter you number.';
                document.querySelector('.phone-invalid-alert').className = 'phone-invalid-alert active';
              }
        }
    }
}