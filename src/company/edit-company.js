import { createClient } from '@supabase/supabase-js'

// Supabase connection
const supabaseUrl = 'https://togfwlwthtllzwmoclsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2Z3bHd0aHRsbHp3bW9jbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzA5MDYsImV4cCI6MjA3OTkwNjkwNn0.n0br_yh9IWxIq_iDxLa5cO-A3G5K9dScYdaaTXAOEnM'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get company ID from URL
const urlParams = new URLSearchParams(window.location.search)
const companyId = urlParams.get('id')

// Load company when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (companyId) {
        loadCompany()
    } else {
        alert('No company ID provided')
        window.location.href = '/'
    }
})

// Load company data into form
async function loadCompany() {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

    if (error) {
        alert('Error loading company: ' + error.message)
        window.location.href = '/'
        return
    }

    // Populate form fields
    document.getElementById('companyName').value = data.company_name
    document.getElementById('hasDba').value = data.has_dba
    document.getElementById('dbaName').value = data.dba_name
    document.getElementById('companyPhone').value = data.company_phone
    document.getElementById('addressLine1').value = data.address_line1
    document.getElementById('addressLine2').value = data.address_line2 || ''
    document.getElementById('city').value = data.city
    document.getElementById('state').value = data.state
    document.getElementById('zip').value = data.zip

    // Handle DBA field styling
    if (data.has_dba === 'No') {
        document.getElementById('dbaName').readOnly = true
        document.getElementById('dbaName').style.backgroundColor = '#f0f0f0'
    }
}

// Handle DBA change
window.handleDbaChange = function() {
    const hasDba = document.getElementById('hasDba').value
    const companyName = document.getElementById('companyName').value.trim()
    const dbaField = document.getElementById('dbaName')

    if (hasDba === 'No') {
        dbaField.value = companyName
        dbaField.readOnly = true
        dbaField.style.backgroundColor = '#f0f0f0'
    } else if (hasDba === 'Yes') {
        dbaField.value = ''
        dbaField.readOnly = false
        dbaField.style.backgroundColor = 'white'
    }
}

// Auto-format phone number as (###) ###-####
window.formatPhoneNumber = function(input) {
    let value = input.value.replace(/\D/g, '')

    if (value.length > 10) {
        value = value.substring(0, 10)
    }

    if (value.length > 6) {
        input.value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6)
    } else if (value.length > 3) {
        input.value = '(' + value.substring(0, 3) + ') ' + value.substring(3)
    } else if (value.length > 0) {
        input.value = '(' + value
    } else {
        input.value = ''
    }
}

// Update company
window.updateCompany = async function() {
    const companyName = document.getElementById('companyName').value.trim()
    const hasDba = document.getElementById('hasDba').value
    const dbaName = document.getElementById('dbaName').value.trim()
    const companyPhone = document.getElementById('companyPhone').value.trim()
    const addressLine1 = document.getElementById('addressLine1').value.trim()
    const addressLine2 = document.getElementById('addressLine2').value.trim()
    const city = document.getElementById('city').value.trim()
    const state = document.getElementById('state').value
    const zip = document.getElementById('zip').value.trim()

    // Validation
    if (!companyName) { alert('Company Name is required.'); return }
    if (!hasDba) { alert('Please select if company uses DBA.'); return }
    if (!dbaName) { alert('DBA Name is required.'); return }
    if (!companyPhone) { alert('Company Phone is required.'); return }
    if (!addressLine1) { alert('Address Line 1 is required.'); return }
    if (!city) { alert('City is required.'); return }
    if (!state) { alert('State is required.'); return }
    if (!/^\d{5}$/.test(zip)) { alert('Zip Code must be exactly 5 digits.'); return }

    // Check for duplicate Company Name (exclude current record)
    const { data: existingCompanyName, error: companyNameError } = await supabase
        .from('companies')
        .select('id')
        .ilike('company_name', companyName)
        .is('deleted_at', null)
        .neq('id', companyId)

    if (companyNameError) {
        alert('Error checking for duplicates: ' + companyNameError.message)
        return
    }

    if (existingCompanyName && existingCompanyName.length > 0) {
        alert('A company with this name already exists. Please use a different name.')
        return
    }

    // Check for duplicate DBA Name (exclude current record)
    const { data: existingDbaName, error: dbaNameError } = await supabase
        .from('companies')
        .select('id')
        .ilike('dba_name', dbaName)
        .is('deleted_at', null)
        .neq('id', companyId)

    if (dbaNameError) {
        alert('Error checking for duplicates: ' + dbaNameError.message)
        return
    }

    if (existingDbaName && existingDbaName.length > 0) {
        alert('A company with this DBA name already exists. Please use a different DBA name.')
        return
    }

    const { error } = await supabase
        .from('companies')
        .update({
            company_name: companyName,
            has_dba: hasDba,
            dba_name: dbaName,
            company_phone: companyPhone,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            zip: zip,
            modified_by: 'Admin',
            modified_at: new Date().toISOString()
        })
        .eq('id', companyId)

    if (error) {
        alert('Error updating company: ' + error.message)
        return
    }

    alert('Company updated successfully!')
    window.location.href = '/'
}