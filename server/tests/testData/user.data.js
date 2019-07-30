const user = [
  // correct details 0
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong email 1
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'testdomain.com',
      password: 'P@ssword123'
    }
  },
  // no firstname 2
  {
    user: {
      firstname: '',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // no lastname 3
  {
    user: {
      firstname: 'test',
      lastname: '',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // no username 4
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: '',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid firstname 5
  {
    user: {
      firstname: 'test2019',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid lastname 6
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname2019',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username length < 3 7
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'te',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username length > 16 8
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername65281092',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username characters 9
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'test@*#jos',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // correct login details 10
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong login email 11
  {
    user: {
      email: 'wrong@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong password 12
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@ssword123ndo'
    }
  },
  // invalid email 13
  {
    user: {
      email: 'testtestdomain.com',
      password: 'P@ssword123'
    }
  },
  // weak password 14
  {
    user: {
      email: 'test@testdomain.com',
      password: 'password'
    }
  },
  // short password 15
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@s1'
    }
  },
  // short password signup 16
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'P@s1'
    }
  },
  // weak password signup 17
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'password'
    }
  },
];

export default user;
