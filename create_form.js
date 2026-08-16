const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/forms.body'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function main() {
  console.log('Authenticating...');
  const auth = await authorize();
  const forms = google.forms({version: 'v1', auth});

  console.log('Creating form shell...');
  const newForm = {
    info: {
      title: 'Loma Prieta Elementary - Garden Program Interest Survey',
      documentTitle: 'Garden Program Form',
    },
  };
  
  const createResponse = await forms.forms.create({
    requestBody: newForm,
  });
  
  const formId = createResponse.data.formId;
  console.log(`Created Form URL: https://docs.google.com/forms/d/${formId}/edit`);

  // Setting up the detailed description requires an update to the form settings
  await forms.forms.batchUpdate({
    formId: formId,
    requestBody: {
      requests: [{
        updateFormInfo: {
          info: {
            description: 'We are exploring ways to increase participation and support of the garden space at Loma Prieta Elementary School. Your feedback as educators is invaluable to help us design a program that best supports your teaching objectives and fits seamlessly into your schedule. Please take a few moments to share your thoughts.'
          },
          updateMask: 'description'
        }
      }]
    }
  });

  console.log('Adding questions...');
  const newQuestions = {
    requests: [
      {
        createItem: {
          item: {
            title: 'How interested are you in incorporating a garden program into your classroom curriculum?',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    {value: 'Very interested'},
                    {value: 'Somewhat interested'},
                    {value: 'Neutral'},
                    {value: 'Not very interested'},
                    {value: 'Not at all interested'}
                  ]
                }
              }
            }
          },
          location: { index: 0 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Which subject areas would you most like to see supported by the garden program?',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'CHECKBOX',
                  options: [
                    {value: 'Science / Environmental Studies'},
                    {value: 'Math (e.g., measuring, geometry)'},
                    {value: 'English Language Arts'},
                    {value: 'Social Studies / History'},
                    {value: 'Art'},
                    {value: 'Health / Nutrition'},
                    {value: 'Other'}
                  ]
                }
              }
            }
          },
          location: { index: 1 }
        }
      },
      {
        createItem: {
          item: {
            title: 'How do you envision utilizing the garden space with your students?',
            description: 'For example: hands-on experiments, quiet reading time, art projects, etc.',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 2 }
        }
      },
      {
        createItem: {
          item: {
            title: 'What times of day would you ideally prefer to use the garden space?',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'CHECKBOX',
                  options: [
                    {value: 'Morning (Before recess)'},
                    {value: 'Mid-day (Between recess and lunch)'},
                    {value: 'Afternoon (After lunch)'}
                  ]
                }
              }
            }
          },
          location: { index: 3 }
        }
      },
      {
        createItem: {
          item: {
            title: 'What challenges or blockers have you experienced or do you foresee when trying to take students outside for instructional time?',
            questionItem: {
              question: {
                required: false,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 4 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Please share any additional thoughts, concerns, or suggestions you have regarding the garden program.',
            questionItem: {
              question: {
                required: false,
                textQuestion: { paragraph: true }
              }
            }
          },
          location: { index: 5 }
        }
      },
      {
        createItem: {
          item: {
            title: 'Would you be willing to talk to the garden coordinators about your experience with the garden program to date?',
            questionItem: {
              question: {
                required: false,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    {value: 'Yes'},
                    {value: 'No'}
                  ]
                }
              }
            }
          },
          location: { index: 6 }
        }
      }
    ]
  };

  await forms.forms.batchUpdate({
    formId: formId,
    requestBody: newQuestions,
  });

  console.log('Questions added successfully! The form is ready.');
}

main().catch(console.error);
