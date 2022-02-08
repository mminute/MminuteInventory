const applicationInfo = {
  applicationName: 'Minute Inventory',
  applicationVersion: '0.1',
  authors: ['@mminute'],
  version: '0.1',
  website: 'http://www.masonjennings.io/', // TODO: Update for project website
};

export default applicationInfo;

/*
https://www.electronjs.org/docs/latest/api/app#appsetaboutpaneloptionsoptions

app.setAboutPanelOptions(options: Object)
applicationName String (optional) - The app's name.
applicationVersion String (optional) - The app's version.
copyright String (optional) - Copyright information.
version String (optional) macOS - The app's build version number.
credits String (optional) macOS Windows - Credit information.
authors String[] (optional) Linux - List of app authors.
website String (optional) Linux - The app's website.
iconPath String (optional) Linux Windows - Path to the app's icon in a JPEG or PNG file format. On Linux, will be shown as 64x64 pixels while retaining aspect ratio.
*/
