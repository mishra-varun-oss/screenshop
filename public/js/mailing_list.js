        new Vue({
            el: '#mailingListForm',
            data: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: '',
                state: '',
                country: '',
                productNiche: '',
                productNicheOptions: ['Fashion', 'Beauty', 'Electronics', 'Other'],
                tiktok: '',
                instagram: '',
                socialX: '',
                facebook: '',
                youtube: '',
                snapchat: ''
            },
            methods: {
                submitForm: function () {

                    const formData = {
                        first_name: this.firstName,
                        last_name: this.lastName,
                        email: this.email,
                        phone: this.phone,
                        city: this.city,
                        state: this.state,
                        country: this.country,
                        product_niche: this.productNiche,
                        tiktok_username: this.tiktok,
                        instagram_username: this.instagram,
                        socialx_username: this.socialX,
                        facebook_profile: this.facebook,
                        youtube_channel: this.youtube,
                        snapchat_username: this.snapchat
                    };
                    console.log(formData);

                    axios.post('/mailing_list', formData)
                      .then(response => {
                          console.log('Form submitted successfully:', response.data);
                          $('#mailingListModal').modal('hide');
                      })
                      .catch(error => {
                          console.error('Error submitting form:', error);
                      });

                    //$('#mailingListModal').modal('hide');
                }
            }
        });
