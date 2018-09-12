define(['modules/api',
        'modules/backbone-mozu',
        'underscore',
        'modules/jquery-mozu',
        'hyprlivecontext',
        'hyprlive',
        "modules/block-ui",
        'modules/editable-view'
    ],
    function(api, Backbone, _, $, HyprLiveContext, Hypr, blockUiLoader, EditableView) {

        var CustomRequestFormView = EditableView.extend({
            templateName: 'modules/page-footer/footer-forms/customrequest-form',
            autoUpdate: [
                'firstname',
                'lastname',
                'email',
                'businessAddr',
                'collection',
                'items',
                'pantone',
                'instruction',
                'notes'
            ],
            setError: function(msg) {
                this.model.set('isLoading', false);
                this.trigger('error', { message: msg || 'Something went wrong!! Please try after sometime!' });
            },
            submitRequest: function() {
                var self = this;
                var labels = HyprLiveContext.locals.labels;
                var firstname = self.model.get('firstname');
                var lastname = self.model.get('lastname');
                var email = self.model.get('email');
                var businessAddr = self.model.get('businessAddr');
                var collection = self.model.get('collection');
                var items = self.model.get('items');
                var pantone = self.model.get('pantone');
                var instruction = self.model.get('instruction');
                var notes = self.model.get('notes');
                if (!self.model.validate()) {
                    api.request("POST", "/commonRoute",
                    {
                        requestFor:'customRequestAncap',
                        firstname:firstname,
                        lastname: lastname,
                        email:email,
                        businessAddr: businessAddr,
                        collection: collection,
                        items: items,
                        pantone: pantone,
                        instruction: instruction,
                        notes: notes
                    }).then(function (response){
                        var errorMessage = labels.emailMessage;
                        if(response[0]) {
                            if(response[0] !== 'two') {
                                console.log("Error : "+response[0]);
                                errorMessage  = labels.contactUsError;
                                $("#customRequestError").html(errorMessage);
                                $("#customRequestError").show();    
                            } else {
                                $("#customRequestError").html(errorMessage);
                                $('#customrequestForm').each(function(){
                                    this.reset();
                                });
                                $("#customRequestError").show().delay(4000).fadeOut();    
                            }
                        }
                    });
                } else {
                    $('#customRequestError').html("Invalid form submission");
                    console.log("Error : ");
                }
                
            },
            render: function() {
                Backbone.MozuView.prototype.render.apply(this);
            }
        });

        var validationfields = {
            'email': [{
                required: true,
                msg: Hypr.getLabel('fieldEmpty')
            },
            {
                pattern: 'email',
                msg: Hypr.getLabel('emailMissing')
            }],
            'firstname': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'lastname': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'businessAddr': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'collection': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'items': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'pantone': {
                required: true,
                msg: Hypr.getLabel("fieldEmpty")
            },
            'instruction': {
                required: true,
                msg: Hypr.getLabel('fieldEmpty')
            },
            'notes': {
                required: true,
                msg: Hypr.getLabel('fieldEmpty')
            }
        };
        var Model = Backbone.MozuModel.extend({
            validation: validationfields
        });
        var $customRequestFormEl = $('#customRequestForm');
        var customRequestFormView = window.view = new CustomRequestFormView({
            el: $customRequestFormEl,
            model: new Model({})
        });
        customRequestFormView.render();
    });