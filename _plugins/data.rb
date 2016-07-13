module EITI

  module Data

    # access a nested property of the (assumed) Hash data:
    #
    # get({"a" => 1000}, "a") == 1000
    # get({"2001" => 5}, 2001) === 5
    def get(data, *keys)
      # bail if there"s no data
      return nil if data == nil

      # coerce all of the keys to strings,
      # and filter out any empty ones
      keys = keys.map(&:to_s).select { |k| !k.empty? }
      for key in keys
        key.split(".").each do |k|
          data = data[k]
          if not data
            return nil
          end
        end
      end
      data
    end

    # "unwrap" values in a 2-level hash:
    #
    # map_hash({'2011' => {'volume' => 100}}, 'volume')
    # > {'2011' => 100}
    def map_hash(data, key)
      data.to_h().map { |_key, value| [_key, get(value, key)] }.to_h
    end

    # pad the provided string with the provided padding character (or a
    # space, by default) if its length is less than a given length
    def pad_left(str, len, pad = " ")
      pad_by = len - str.size
      if pad_by > 0
        return pad * pad_by + str
      end
      str
    end

    # attempt to look up a term in a dictionary (hash),
    # and return the value if that key exists; otherwise, return the key
    def lookup(term, dict)
      (dict.key? term) ? dict[term] : term
    end

    # create an integer range array from either a start and end number, or
    # a 2-element array
    def range(start, finish = nil)
      if start.is_a? Array
        (start, finish) = start
      end
      (start..finish).to_a
    end

    # convert (or map) a value to floats
    def to_f(x)
      (x.is_a? Array) ? x.map(&:to_f) : x.to_f
    end

    # convert (or map) a value to integers
    def to_i(x)
      (x.is_a? Array) ? x.map(&:to_i) : x.to_i
    end

    # convert (or map) a value to strings
    def to_s(x)
      (x.is_a? Array) ? x.map(&:to_s) : x.to_s
    end

    # attempts to find a substring
    # returns the value true if the key exists; otherwise, return nil
    def is_in(term, str)
      if str
        (str.include? term) ? true : nil
      end
    end

    # takes a domain and returns a list of numbers within that domain
    # incrimented by 1
    # e.g '[0,5]' => [0,1,2,3,4,5]
    # e.g [0,5] => [0,1,2,3,4,5]
    # If the input is not a string, it returns the input value
    # e.g 5 => 5
    def to_list(domain)
      def create_list(domain)
        arr = []
        $i = domain[0]
        $num = domain[1]
        for i in $i..$num
          arr.push(i)
        end
        arr
      end

      if domain.is_a? Array
        create_list(domain)
      elsif domain.is_a? String
        domain = JSON.parse(domain)
        create_list(domain)
      else
        domain
      end
    end
  end
end

Liquid::Template.register_filter(EITI::Data)
