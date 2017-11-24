'use strict';
const moment = require('moment');
const extractFirstLetter = (text) => text.charAt(0);

exports.userTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		let srno=i+1;
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			sr_no: srno,
			contact_name: data[i].contact_name || '-',
			contact_telephoneno: data[i].contact_telephoneno || '-',
			email_address: data[i].email_address || '-',
			school_name: data[i].school_name,
			school_address: data[i].school_address,
			no_of_students: data[i].no_of_students,  
			pilot_request: `<span class="label label-sm tooltips label-${status_list.class[data[i].pilot_request]}" data-original-title="${status_list.status[data[i].pilot_request]}">${extractFirstLetter(status_list.status[data[i].pilot_request])}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-user/${data[i]._id}" class="btn btn-xs btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-eye"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: recordsTotal,
		draw: draw
	};
};

exports.sortingDatatable = (col,order) => {
	let columnindx,dir,result={};
	    columnindx = order[0].column;
	    dir 	   = order[0].dir; 
    var fieldname  = col[columnindx].data;
    result[fieldname]=dir;
    return result;
}

exports.socialLinkTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			url: data[i].url,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
					
						<a href="#!/edit-sociallink/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.whatdoStepTable = (status_list, recordsTotal, data, draw) => {
	
		let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
	result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			short_description: data[i].short_description,
			long_description: data[i].long_description,
			order: data[i].order,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
					 	<a href="#!/view-whatdosteps/${data[i].slug}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-whatdosteps/${data[i].slug}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};


exports.cmsTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			meta_title: data[i].meta_title,
			meta_description: data[i].meta_description || '-',
			order: data[i].order || '-',
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-cms/${data[i].slug}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-cms/${data[i].slug}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.privacypolicyTable = (status_list, recordsTotal, data, draw) => {
	
		let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			description: data[i].description,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-privacypolicy/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-privacypolicy/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.blogTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			type: data[i].type,
			slug: data[i].slug,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-blog/${data[i].slug}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-blog/${data[i].slug}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};


exports.faqTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			question: data[i].question,
			order: data[i].order,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-faq/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-faq/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.cmsLinkTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			url: data[i].url || '-',
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-cms-link/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-cms-link/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.testimonialTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			name: data[i].name,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-testimonial/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-testimonial/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
