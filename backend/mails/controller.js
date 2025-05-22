import MailSchema from "./model.js";

export const createMail = async (req, res) => {
  const { sender, reciever, type, subject , body } = req.body;
  try {
    const mail = new MailSchema({
      sender,
      reciever,
      type,
      subject,
      body,
    });
    mail.save();
    res.status(201).json(mail);
  } catch (error) {
    res.status(500).json({ message: "Error creating mail", error });
  }
};

export const getMails = async (req, res) => {
  try {
    const mails = await MailSchema.find();
    res.status(200).json(mails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and delete it
    await MailSchema.findByIdAndDelete(id);

  } catch (error) {
    res.status(500).json({ message: "Error deleting mail", error });
  }
};

export const starMail = async (req, res) => {
  const { id } = req.params;
  try {
    const mail = await MailSchema.findById(id);
    // Find the mail by ID and mark it as starred
    const updatedmail =await MailSchema.findByIdAndUpdate(
      id, 
      {$set: {'starred': !mail.starred}},
      {new: true}
    );
    res.status(200).json(updatedmail);
  } catch (error) {
    res.status(500).json({ message: "Error starring mail", error });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the mail by ID and mark it as read
    const mail = await MailSchema.findById(id);
    if(mail.status == 'seen'){
      const new_mail = await MailSchema.findByIdAndUpdate(id, {$set :{
        'status': "unseen"
      }},{
        new:true
      } )
    }else{
      const new_mail = await MailSchema.findByIdAndUpdate(id, {$set :{
        'status': "seen"
      }},{
        new:true
      } )
    }
    res.status(200).json(new_mail);
  } catch (error) {
    res.status(500).json({ message: "Error marking mail as read", error });
  }
};
