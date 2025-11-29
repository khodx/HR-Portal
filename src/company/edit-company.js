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
    const {data, error} = await supabase
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
    document.getElementById('mailingSameAsPhysical').value = data.mailing_same_as_physical || ''
    document.getElementById('mailingAddressLine1').value = data.mailing_address_line1 || ''
    document.getElementById('mailingAddressLine2').value = data.mailing_address_line2 || ''
    document.getElementById('mailingCity').value = data.mailing_city || ''
    document.getElementById('mailingState').value = data.mailing_state || ''
    document.getElementById('mailingZip').value = data.mailing_zip || ''
    document.getElementById('ein').value = data.ein || ''
    document.getElementById('payrollTaxAccount').value = data.payroll_tax_account || ''

// Handle mailing address visibility
    if (data.mailing_same_as_physical) {
        document.getElementById('mailingAddressFields').classList.remove('hidden')
        document.getElementById('taxInfoSection').classList.remove('hidden')

        if (data.mailing_same_as_physical === 'Yes') {
            // Make fields read-only
            document.getElementById('mailingAddressLine1').readOnly = true
            document.getElementById('mailingAddressLine2').readOnly = true
            document.getElementById('mailingCity').readOnly = true
            document.getElementById('mailingState').disabled = true
            document.getElementById('mailingZip').readOnly = true
            // Gray background for read-only
            document.getElementById('mailingAddressLine1').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingAddressLine2').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingCity').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingState').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingZip').style.backgroundColor = '#f0f0f0'
        }
    }
// Handle DBA change
    window.handleDbaChange = function () {
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

// Handle Mailing Address change
    window.handleMailingAddressChange = function () {
        const mailingSame = document.getElementById('mailingSameAsPhysical').value
        const mailingFields = document.getElementById('mailingAddressFields')
        const taxInfoSection = document.getElementById('taxInfoSection')

        if (mailingSame === 'Yes') {
            mailingFields.classList.remove('hidden')
            taxInfoSection.classList.remove('hidden')
            // Copy physical address to mailing fields
            document.getElementById('mailingAddressLine1').value = document.getElementById('addressLine1').value
            document.getElementById('mailingAddressLine2').value = document.getElementById('addressLine2').value
            document.getElementById('mailingCity').value = document.getElementById('city').value
            document.getElementById('mailingState').value = document.getElementById('state').value
            document.getElementById('mailingZip').value = document.getElementById('zip').value
            // Make fields read-only
            document.getElementById('mailingAddressLine1').readOnly = true
            document.getElementById('mailingAddressLine2').readOnly = true
            document.getElementById('mailingCity').readOnly = true
            document.getElementById('mailingState').disabled = true
            document.getElementById('mailingZip').readOnly = true
            // Gray background for read-only
            document.getElementById('mailingAddressLine1').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingAddressLine2').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingCity').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingState').style.backgroundColor = '#f0f0f0'
            document.getElementById('mailingZip').style.backgroundColor = '#f0f0f0'
        } else if (mailingSame === 'No') {
            mailingFields.classList.remove('hidden')
            taxInfoSection.classList.remove('hidden')
            // Clear mailing fields
            document.getElementById('mailingAddressLine1').value = ''
            document.getElementById('mailingAddressLine2').value = ''
            document.getElementById('mailingCity').value = ''
            document.getElementById('mailingState').value = ''
            document.getElementById('mailingZip').value = ''
            // Make fields editable
            document.getElementById('mailingAddressLine1').readOnly = false
            document.getElementById('mailingAddressLine2').readOnly = false
            document.getElementById('mailingCity').readOnly = false
            document.getElementById('mailingState').disabled = false
            document.getElementById('mailingZip').readOnly = false
            // White background for editable
            document.getElementById('mailingAddressLine1').style.backgroundColor = 'white'
            document.getElementById('mailingAddressLine2').style.backgroundColor = 'white'
            document.getElementById('mailingCity').style.backgroundColor = 'white'
            document.getElementById('mailingState').style.backgroundColor = 'white'
            document.getElementById('mailingZip').style.backgroundColor = 'white'
        } else {
            mailingFields.classList.add('hidden')
            taxInfoSection.classList.add('hidden')
        }
    }

// Auto-format phone number as (###) ###-####
    window.formatPhoneNumber = function (input) {
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

// Auto-format EIN as ##-#######
    window.formatEIN = function (input) {
        let value = input.value.replace(/\D/g, '')

        if (value.length > 9) {
            value = value.substring(0, 9)
        }

        if (value.length > 2) {
            input.value = value.substring(0, 2) + '-' + value.substring(2)
        } else {
            input.value = value
        }
    }

// Auto-format Payroll Tax Account as ###-####-#
    window.formatPayrollTax = function (input) {
        let value = input.value.replace(/\D/g, '')

        if (value.length > 8) {
            value = value.substring(0, 8)
        }

        if (value.length > 7) {
            input.value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7)
        } else if (value.length > 3) {
            input.value = value.substring(0, 3) + '-' + value.substring(3)
        } else {
            input.value = value
        }
    }

// Update company
    window.updateCompany = async function () {
        const companyName = document.getElementById('companyName').value.trim()
        const hasDba = document.getElementById('hasDba').value
        const dbaName = document.getElementById('dbaName').value.trim()
        const companyPhone = document.getElementById('companyPhone').value.trim()
        const addressLine1 = document.getElementById('addressLine1').value.trim()
        const addressLine2 = document.getElementById('addressLine2').value.trim()
        const city = document.getElementById('city').value.trim()
        const state = document.getElementById('state').value
        const zip = document.getElementById('zip').value.trim()
        const mailingSameAsPhysical = document.getElementById('mailingSameAsPhysical').value
        const ein = document.getElementById('ein').value.trim()
        const payrollTaxAccount = document.getElementById('payrollTaxAccount').value.trim()

        // Get mailing address fields
        let mailingAddressLine1, mailingAddressLine2, mailingCity, mailingState, mailingZip

        if (mailingSameAsPhysical === 'Yes') {
            mailingAddressLine1 = addressLine1
            mailingAddressLine2 = addressLine2
            mailingCity = city
            mailingState = state
            mailingZip = zip
        } else {
            mailingAddressLine1 = document.getElementById('mailingAddressLine1').value.trim()
            mailingAddressLine2 = document.getElementById('mailingAddressLine2').value.trim()
            mailingCity = document.getElementById('mailingCity').value.trim()
            mailingState = document.getElementById('mailingState').value
            mailingZip = document.getElementById('mailingZip').value.trim()
        }

        // Validation
        if (!companyName) {
            alert('Company Name is required.');
            return
        }
        if (!hasDba) {
            alert('Please select if company uses DBA.');
            return
        }
        if (!dbaName) {
            alert('DBA Name is required.');
            return
        }
        if (!companyPhone) {
            alert('Company Phone is required.');
            return
        }
        if (!addressLine1) {
            alert('Address Line 1 is required.');
            return
        }
        if (!city) {
            alert('City is required.');
            return
        }
        if (!state) {
            alert('State is required.');
            return
        }
        if (!/^\d{5}$/.test(zip)) {
            alert('Zip Code must be exactly 5 digits.');
            return
        }
        if (!mailingSameAsPhysical) {
            alert('Please select if Mailing Address is same as Physical.');
            return
        }

        // Mailing address validation if different
        if (mailingSameAsPhysical === 'No') {
            if (!mailingAddressLine1) {
                alert('Mailing Address Line 1 is required.');
                return
            }
            if (!mailingCity) {
                alert('Mailing City is required.');
                return
            }
            if (!mailingState) {
                alert('Mailing State is required.');
                return
            }
            if (!/^\d{5}$/.test(mailingZip)) {
                alert('Mailing Zip Code must be exactly 5 digits.');
                return
            }
        }

        // EIN validation (##-#######)
        if (!/^\d{2}-\d{7}$/.test(ein)) {
            alert('EIN must be in format ##-#######.');
            return
        }

        // Payroll Tax Account validation (###-####-#)
        if (!/^\d{3}-\d{4}-\d{1}$/.test(payrollTaxAccount)) {
            alert('Payroll Tax Account must be in format ###-####-#.');
            return
        }

        // Check for duplicate Company Name (exclude current record)
        const {data: existingCompanyName, error: companyNameError} = await supabase
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
        const {data: existingDbaName, error: dbaNameError} = await supabase
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

        const {error} = await supabase
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
                mailing_same_as_physical: mailingSameAsPhysical,
                mailing_address_line1: mailingAddressLine1,
                mailing_address_line2: mailingAddressLine2,
                mailing_city: mailingCity,
                mailing_state: mailingState,
                mailing_zip: mailingZip,
                ein: ein,
                payroll_tax_account: payrollTaxAccount,
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
}