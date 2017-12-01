var TableAjax = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            autoclose: true
        });
    };

    var handleRecords = function (options) {


        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (response) {
                // execute some code after table records loaded
                setTimeout(function() { $('.tooltips').tooltip(); }, 1000);
            },
            onError: function (grid, err) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 
                language: {
                    searchPlaceholder: "Type to search...",
                    search: "",
                    emptyTable: 'No records found to show'
                },
                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                // "dom": "<'row'<'col-md-7 col-sm-12'pli><'col-md-5 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                "dom": "<'row'<'col-md-7 col-sm-12 fullLftNW'f><'col-md-5 col-sm-12'<'table-group-actions pull-right'>>r><'table-responsive't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [10, 20, 50, 100, 150, 200],
                    [10, 20, 50, 100, 150, 200] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": baseUrl(options.url), // ajax source
                    "headers": {
                        "Authorization": "Bearer " + JSON.parse(prefix('token'))
                    },
                    "error": function (err) {
                        
                        var message = "Could not complete request. Please check your internet connection";
                        App.unblockUI(grid.gettableContainer());
                        if( err.status === 401  ) {
                            if( err.responseJSON.errors.code === "invalid_token" ) {
                                var $body = angular.element(document.body);            
                                var $rootScope = $body.injector().get('$rootScope');
                                message = "Your Session has been expired, please login again to continue.";
                                setTimeout(function () {
                                    $rootScope.clearToken();    
                                }, 1500);
                            }
                        }
                        if( err.status===500){
                            message=err.responseJSON.errors.message;
                         }

                        App.alert({
                            type: 'danger',
                            icon: 'warning',
                            message: message,
                            container: grid.getTableWrapper(),
                            place: 'prepend'
                        });
                    }
                },
                "columns": options.columns,
                "serverSide": true,
                "searchable":true,

                //dom:"<'row'<'col-sm-12'tr>>" +"<'row'<'col-sm-6'p><'col-sm-3'l><'col-sm-3'i>>"
                //"paging": false
                // "order": [[ 3, "asc" ]] // set first column as a default sort by asc
            }
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            var selectedRows=grid.getSelectedRows();
                      
            if (action.val() !== "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
              
              if(action.val()==="Approve"){
                let approveCheck=true,id=[];
                  selectedRows.map(function(row){
                     row=JSON.parse(row);
                     id.push(row._id);
                     if(row.pilot_request=="Approved"){
                        App.alert({
                            type: 'danger',
                            icon: 'warning',
                            message: 'You can Approved only pending and rejected request.',
                            container: grid.getTableWrapper(),
                            place: 'prepend'
                        });
                        approveCheck=false;
                        return;
                     }
                  });
                  if(approveCheck){
                      bootbox.confirm({
                        title: "Pilot Request",
                        message: `Are you sure you want to ${action.val()} ?`,
                        buttons: {
                            cancel: {
                                label: '<i class="fa fa-times"></i> Cancel'
                            },
                            confirm: {
                                label: `<i class="fa fa-check"></i> ${action.val()}`
                            }
                        },
                        callback: function (result) {
                            if(result===true){
                              grid.setAjaxParam("id", id);    
                              grid.getDataTable().ajax.reload();
                              grid.clearAjaxParams();
                            }
                            else{
                               return;
                            }
                        },
                        size:"small"
                      });
                  }

                }
                else if(action.val()==="Reject"){
                    let rejectCheck=true,id=[];
                  selectedRows.map(function(row){
                     row=JSON.parse(row);
                     id.push(row._id);
                     if(row.pilot_request=="Approved" || row.pilot_request=="Rejected"){
                        App.alert({
                            type: 'danger',
                            icon: 'warning',
                            message: 'You can Reject only pending request.',
                            container: grid.getTableWrapper(),
                            place: 'prepend'
                        });
                        rejectCheck=false;
                        return;
                     }
                  });
                    if(rejectCheck){
                       bootbox.dialog({
                         title:'Are you sure you want to Reject ?',
                         message: `<form>
                                     <div class="form-group">
                                      <select class="form-control target">
                                         <option value="">Select Reason</option>
                                         <option>I want to reject</option>
                                         <option>Other</option>
                                      </select>
                                     </div>
                                     <div class="form-group">
                                      <input type="text" class="form-control" style="display:none;" placeholder="Enter reason" id="reason" required>
                                    </div>
                                  </form>`,
                         buttons: {
                            cancel: {
                                label: '<i class="fa fa-times"></i> Cancel'
                            },
                            confirm: {
                                label: `<i class="fa fa-check"></i> ${action.val()}`,
                                callback:function(result){
                                    let selectedReason=$(".target option:selected").text();
                                    let enteredReason=$("#reason").val();
                                    grid.setAjaxParam("id", id); 
                                    if(selectedReason=="Other"){
                                      grid.setAjaxParam("reject_reason", enteredReason);   
                                      grid.getDataTable().ajax.reload();
                                      grid.clearAjaxParams();
                                    }
                                    else{
                                      grid.setAjaxParam("reject_reason", selectedReason);   
                                      grid.getDataTable().ajax.reload();
                                      grid.clearAjaxParams();  
                                    }
                                }
                            }
                         },
                         size:"small"
                       });

                        $( ".target" ).change(function() {
                             if(this.value == 'Other'){
                              $('#reason').show();
                             }
                             else{
                              $('#reason').hide();
                             }
                        });
                    }
                }
                else if(action.val()==="remove"){
                  bootbox.confirm({
                    title: "Delete ",
                    message: "Are you sure you want to delete?",
                    buttons: {
                        cancel: {
                            label: '<i class="fa fa-times"></i> Cancel'
                        },
                        confirm: {
                            label: '<i class="fa fa-check"></i> Confirm'
                        }
                    },
                    callback: function (result) {
                        if(result===true){
                          grid.getDataTable().ajax.reload();
                          grid.clearAjaxParams();
                        }
                        else{
                           return;
                        }
                    },
                    size:"small"
                 });
                }
                else{
                  grid.getDataTable().ajax.reload();
                  grid.clearAjaxParams();
                }
             
                
            } else if (action.val() === "") {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
    };
     
    return {

        //main function to initiate the module
        init: function (options) {

            initPickers();
            handleRecords(options);
        }

    };

}();