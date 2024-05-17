this.$watch('region', value => {
  if(value != '') this.validRegion = true
  if(this.validAddress && this.validRegion && this.validComuna){
            this.btn.removeAttribute('disabled')
            const paramsArray = []
            const urlObj = new URL(this.form.action)
            const params = new URLSearchParams(urlObj.search);
            for (const [key, value] of params.entries()) {
              paramsArray.push({ key, value });
            }
            const items = [{key:'checkout[shipping_address][address1]', value: this.address1},{key:'checkout[shipping_address][city]', value: this.comuna }, {key:'checkout[shipping_address][province]', value: this.region}]

            console.log(items)

            items.forEach(el => {
              console.log(el)
              const index = paramsArray.findIndex(param => param.key === el.key);
              console.log(index)
              if(index !== -1){
                console.log('entra aca')
                paramsArray[index].value = el.value;
              }else {
                console.log('o entra aca')
                paramsArray.push(el);
              }
            })

            console.log(paramsArray)

          }else{
            this.btn.setAttribute('disabled', 'disabled')
          }

      })