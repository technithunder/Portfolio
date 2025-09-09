export const formatPersonResponse = (
  person: any,
  includeDepartment: boolean = false,
  progress: any = null
) => {
  return {
    BasicInfo: {
      id: person.id,
      role: person.role,
      position: person.position,
      joiningDate: person.joiningDate,
      firstName: person.firstName,
      lastName: person.lastName,
      earning: person.earning,
      discount: person.discount,
      empId: person.empId,
    },
    PersonalInfo: {
      age: person.age != null ? String(person.age) : null,
      gender: person.gender,
      dob: person.dob,
      address: person.address,
      nationality: person.nationality,
      profilePic: person.image,
      maritalStatus: person.maritalStatus,
      gstNumber: person.gstNumber,
      companyName: person.companyName,
    },
    Qualification: Array.isArray(person.qualification)
      ? person.qualification.map((q) => ({
        id: q.id,
        degree: q.degree,
        university: q.university,
        passingYear: q.passingYear,
        percentage: q.percentage,
      }))
      : [],
    ContactInfo: {
      mobileNumber: person.mobileNumber,
      email: person.email,
    },
    OtherInfo: {
      status: person.status,
      ...(includeDepartment && { department: person.department }),
    },
    Address: Array.isArray(person.addresses)
      ? person.addresses.map((q) => ({
        userId: q.userId,
        id: q.id,
        street: q.street,
        country: q.country,
        state: q.state,
        city: q.city,
        zipCode: q.zipCode,
      }))
      : [],
    BankInfo: {
      accountNumber: person.accountNumber,
      bankBranchName: person.bankBranchName,
      ifscCode: person.ifscCode,
      bankName: person.bankName,
      panCardNumber: person.panCardNumber,
    },
    ProgressInfo: progress
      ? {
        id: progress.id,
        date: progress.date,
        inTime: progress.inTime,
        outTime: progress.outTime,
        leadChecked: progress.leadChecked,
        leadFollowed: progress.leadFollowed,
        checkedTomorrowTasks: progress.checkedTomorrowTasks,
        reportingSheetSent: progress.reportingSheetSent,
        notes: progress.notes
      }
      : {},
  };
};
