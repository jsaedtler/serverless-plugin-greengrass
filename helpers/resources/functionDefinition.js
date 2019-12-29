module.exports = class FunctionDefinition {
  /**
   * Constructor
   * 
   * @param {object} opts
   */
  constructor({ name }) {
    this.name = name
    this.functions = []
  }

  /**
   * Add function
   */
  addFunction({id, functionArn, pinned, executable, memorySize, timeout, encodingType, environment, accessSysfs}) {
    this.functions.push({
      'Id': this.name + id,
      'FunctionArn': functionArn,
      'FunctionConfiguration': {
        'Pinned': pinned || false,
        'Executable': executable,
        'MemorySize': memorySize || 1024,  // default 1 MB, expressed in KB
        'Timeout': timeout || 6, // 6 seconds
        'EncodingType': encodingType || 'json', // binary | json
        'Environment': {
          'Variables': environment || {},
          'AccessSysfs': accessSysfs || false,
        }
      }
    })
  }

  /**
   * Generate CloudFormation JSON
   */
  toCloudFormationObject() {
    return {
      'Type': 'AWS::Greengrass::FunctionDefinition',
      'Properties': {
        'Name': this.name,
        'InitialVersion': {
          'DefaultConfig': {
            'Execution': {
              'IsolationMode': 'GreengrassContainer',
              'RunAs': {
                'Uid': '1',
                'Gid': '10'
              }
            }
          },
          'Functions': this.functions
        }
      }
    }
  }
}
